import { TreeNode } from 'primeng/api';

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
