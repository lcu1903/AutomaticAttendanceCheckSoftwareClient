import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-empty',
    template: ` <div class="h-screen w-screen">
        <router-outlet></router-outlet>
    </div>`,
    imports: [RouterOutlet],
    standalone: true,
})
export class EmptyComponent {
    constructor() { }
}