const tabbable = require("tabbable");
import { useEffect } from "react";

type Descriptor = {
	element: HTMLElement;
	hadTabindex: boolean;
	tabindex: string | null;
};

type Options = {
	disabled?: boolean,
	includeContainer?: boolean,
};

function createDescriptor(element: HTMLElement) : Descriptor {
    return {
        element,
        hadTabindex: element.hasAttribute('tabindex'),
        tabindex: element.getAttribute('tabindex'),
    };
}

function setElementUntabbable(element: HTMLElement) {
    element.setAttribute('tabindex', '-1');
}

function restoreTabbable(descriptor: Descriptor) {
    const { element, hadTabindex, tabindex } = descriptor;

    if (!element) {
        return;
    }

    if (!hadTabindex) {
        element.removeAttribute('tabindex');
    } else {
        element.setAttribute('tabindex', `${tabindex}`);
    }
}

function useUntabbable(ref: React.RefObject<HTMLElement>, options: Options = {} ) {
    const { disabled = false, includeContainer = true } = options;

    useEffect(() => {
        if (disabled) {
            return;
        }

        const tabbableElements = tabbable(ref.current, { includeContainer });
        const descriptors = tabbableElements.map(createDescriptor);

        tabbableElements.forEach(setElementUntabbable);

        return () => {
            descriptors.forEach(restoreTabbable);
        };
    }, [ref, disabled, includeContainer]);
}

export default useUntabbable;
