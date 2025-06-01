import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceDetectionService } from '../../../aacs/service/face-detection/face-detection.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'attendance',
    standalone: false,
    templateUrl: './attendance.component.html',
})
export class AttendanceComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('videoElement', { static: false }) videoElementRef!: ElementRef<HTMLVideoElement>;
    private readonly _unsubscribeAll$: Subject<void> = new Subject<void>();
    videoElement: HTMLVideoElement | null = null;
    canvasElement: HTMLCanvasElement | null = null;
    isDetecting = false;
    subjectScheduleId: string | null = null;
    private stream: MediaStream | null = null;
    private faceDetected = false;
    constructor(
        private readonly _faceDetectionService: FaceDetectionService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _activatedRoute: ActivatedRoute,
    ) {
        this._activatedRoute.queryParams.pipe(takeUntil(this._unsubscribeAll$)).subscribe((params) => {
            this.subjectScheduleId = params['subjectScheduleId'] || null;
        });
    }

    async ngOnInit(): Promise<void> {}
    ngOnDestroy(): void {
        this._unsubscribeAll$.next();
        this._unsubscribeAll$.complete();
        this.stopFaceDetection();
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
        }
        this.videoElement = null;
        this.canvasElement = null;
    }

    async ngAfterViewInit(): Promise<void> {
        this.videoElement = this.videoElementRef?.nativeElement;
        await this.loadFaceApiModels();
        this.initializeCamera();
    }

    async loadFaceApiModels() {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
        // Có thể load thêm các model khác nếu cần
    }

    initializeCamera(): void {
        if (!this.videoElement) return;
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                this.stream = stream;
                this.videoElement!.srcObject = stream;
                this.videoElement!.play();
            })
            .catch((err) => {
                console.error('Error accessing camera:', err);
            });
    }

    startFaceDetection(): void {
        if (!this.videoElement) return;
        this.isDetecting = true;

        const detectLoop = async () => {
            if (!this.isDetecting) return;
            const detections = await faceapi.detectSingleFace(this.videoElement!, new faceapi.TinyFaceDetectorOptions());
            if (detections != undefined) {
                if (!this.faceDetected) {
                    this.faceDetected = true;
                    if (!this.canvasElement) {
                        this.canvasElement = document.createElement('canvas');
                    }
                    const context = this.canvasElement.getContext('2d');
                    this.canvasElement.width = this.videoElement!.videoWidth;
                    this.canvasElement.height = this.videoElement!.videoHeight;
                    context?.drawImage(this.videoElement!, 0, 0);

                    const imageData = this.canvasElement.toDataURL('image/jpeg');
                    this.isDetecting = false;
                    await new Promise<void>((resolve) => {
                        this._faceDetectionService
                            .checkFace({ imageData, subjectScheduleId: this.subjectScheduleId! })
                            .pipe(
                                takeUntil(this._unsubscribeAll$),
                                finalize(() => {
                                    this.faceDetected = false;
                                    this.isDetecting = true;
                                    resolve();
                                }),
                            )
                            .subscribe((res) => {
                                if (res.data) {
                                    this._messagePopupService.show(
                                        PopupType.SUCCESS,
                                        'aacs.message.attendanceCheckSuccess',
                                        this._translocoService.translate('aacs.message.attendanceCheckedFor') + ' ' + res.data?.fullName,
                                    );
                                }
                            });
                    });
                    await new Promise((resolve) => setTimeout(resolve, 3000));
                }
            } else {
                this.faceDetected = false;
            }
            requestAnimationFrame(detectLoop);
        };
        detectLoop();
    }

    stopFaceDetection(): void {
        this.isDetecting = false;
    }
}
