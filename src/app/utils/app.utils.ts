import { TreeNode } from 'primeng/api';
import { CmSelectOption } from '../base-components/cm-select/cm-select.component';
import moment from 'moment';

export function buildDynamicTree<T extends Record<string, any>>(
    items: T[],
    options: {
        idField: keyof T;
        parentIdField?: keyof T;
        labelField?: keyof T;
        iconField?: keyof T;
    },
): TreeNode[] {
    const { idField, parentIdField = 'parentId', labelField = 'label', iconField } = options;

    const lookup: Record<string, TreeNode> = {};
    const roots: TreeNode[] = [];

    for (const item of items) {
        const id = String(item[idField]);
        const parentId = item[parentIdField] ? String(item[parentIdField]) : null;

        const node: TreeNode = {
            key: id,
            label: String(item[labelField] ?? ''),
            data: item,
            icon: iconField ? String(item[iconField]) : undefined,
            children: [],
        };

        lookup[id] = node;

        if (parentId) {
            if (!lookup[parentId]) {
                lookup[parentId] = {
                    key: parentId,
                    label: '',
                    children: [],
                };
            }
            lookup[parentId].children!.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots;
}
export function trimFormValues<T>(values: T): T {
    const trimmed: any = {};
    for (const key in values) {
        if (typeof values[key] === 'string') {
            const val = values[key].trim();
            trimmed[key] = val === '' ? null : val;
        } else {
            trimmed[key] = values[key];
        }
    }
    return trimmed;
}
export const WEEK_DAYS_OPTIONS: CmSelectOption[] = [
    { id: '1', name: 'Thứ 2' },
    { id: '2', name: 'Thứ 3' },
    { id: '3', name: 'Thứ 4' },
    { id: '4', name: 'Thứ 5' },
    { id: '5', name: 'Thứ 6' },
    { id: '6', name: 'Thứ 7' },
    { id: '0', name: 'Chủ nhật' }, // 0 là Sunday theo chuẩn JS/TS
];
export const WEEK_DAYS_OPTIONS_ISO: CmSelectOption[] = [
    { id: moment().isoWeekday(1).startOf('day').toISOString(), name: 'Thứ 2' }, // Monday
    { id: moment().isoWeekday(2).startOf('day').toISOString(), name: 'Thứ 3' }, // Tuesday
    { id: moment().isoWeekday(3).startOf('day').toISOString(), name: 'Thứ 4' }, // Wednesday
    { id: moment().isoWeekday(4).startOf('day').toISOString(), name: 'Thứ 5' }, // Thursday
    { id: moment().isoWeekday(5).startOf('day').toISOString(), name: 'Thứ 6' }, // Friday
    { id: moment().isoWeekday(6).startOf('day').toISOString(), name: 'Thứ 7' }, // Saturday
    { id: moment().isoWeekday(7).startOf('day').toISOString(), name: 'Chủ nhật' }, // Sunday
];
