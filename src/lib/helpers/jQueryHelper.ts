export async function getJquery(): Promise<JQueryStatic> {
    const imports = await import('jquery')
    return imports.default;
}
