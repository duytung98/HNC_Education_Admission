export const getElementParent = (event, classElementParent) => {
    event.stopPropagation();
    let targetElement = event.target;
    while (!targetElement.classList.contains(classElementParent)) {
        targetElement = targetElement.parentNode;
        if (!targetElement) return null;
    }
    return targetElement;
}
