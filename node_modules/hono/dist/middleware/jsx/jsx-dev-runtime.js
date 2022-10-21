import { jsx } from '.';
export function jsxDEV(tag, props) {
    const children = props.children ?? [];
    delete props['children'];
    return jsx(tag, props, children);
}
