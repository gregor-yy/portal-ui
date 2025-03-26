export const getScrollbarWidth = () => {
	const tempElement = document.createElement('div');
    tempElement.style.width = '100px';
    tempElement.style.height = '100px';
    tempElement.style.overflow = 'scroll';
    tempElement.style.position = 'absolute';
    tempElement.style.top = '-9999px';

    document.body.appendChild(tempElement);

    const hasScrollbar = document.documentElement.scrollHeight > window.innerHeight

    const width = hasScrollbar ? tempElement.offsetWidth - tempElement.clientWidth : 0;

    document.body.removeChild(tempElement);

	return width;
};
