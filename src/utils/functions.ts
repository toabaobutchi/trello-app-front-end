export const isOutClick = (parent: HTMLElement, child: HTMLElement | null) => {
  return (parent && !parent.contains(child as Node));
}