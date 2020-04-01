import React from "react";
import ReactDOM from "react-dom";

import ownerDocument from "./utils/ownerDocument";
import setRef from "./utils/setRef";
import useForkRef from "./utils/useForkRef";
import useEventCallback from "./utils/useEventCallback";
import { ClickAwayProps } from "./types";

function mapEventPropToEvent(eventProp: string) {
  return eventProp.substring(2).toLowerCase();
}

export const ClickAway = React.forwardRef<unknown, ClickAwayProps>(
  ({ children, mouseEvent = "onClick", touchEvent = "onTouchEnd", onClickAway, onClickIn = () => void 0 }, ref) => {
    const [clicked, setClicked] = React.useState<boolean>(false);
    const movedRef = React.useRef<boolean>(false);
    const nodeRef = React.useRef<HTMLElement | null>(null);
    const mountedRef = React.useRef<boolean>(false);

    React.useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    const handleNodeRef = useForkRef(nodeRef, ref);
    // can be removed if we drop support for non ref forwarding class components
    const handleOwnRef = React.useCallback(
      (instance) => {
        // #StrictMode ready
        setRef(handleNodeRef, ReactDOM.findDOMNode(instance));
      },
      [handleNodeRef],
    );
    const handleRef = useForkRef((children as React.ReactNode & { ref: React.Ref<any> }).ref, handleOwnRef);

    const handleClickIn = React.useCallback(() => {
      setClicked((state) => !state);
      onClickIn();
    }, [onClickIn]);

    const handleClickAway = useEventCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      // The handler doesn't take event.defaultPrevented into account:
      //
      // event.preventDefault() is meant to stop default behaviours like
      // clicking a checkbox to check it, hitting a button to submit a form,
      // and hitting left arrow to move the cursor in a text input etc.
      // Only special HTML elements have these default behaviors.

      // IE 11 support, which trigger the handleClickAway even after the unbind
      if (!mountedRef.current) {
        return;
      }

      // Do not act if user performed touchmove
      if (movedRef.current) {
        movedRef.current = false;
        return;
      }

      // The child might render null.
      if (!nodeRef.current) return;

      // Multi window support
      const doc = ownerDocument(nodeRef.current as HTMLElement);

      if (
        doc.documentElement &&
        doc.documentElement.contains(event.target as Node) &&
        !(nodeRef.current as HTMLElement).contains(event.target as Node)
      ) {
        if (clicked) {
          setClicked(false);
          onClickAway(event);
        }
      }
    });

    const handleTouchMove = React.useCallback(() => {
      movedRef.current = true;
    }, []);

    React.useEffect(() => {
      // eslint-disable-next-line
      // @ts-ignore
      if (touchEvent !== false) {
        const mappedTouchEvent = mapEventPropToEvent(touchEvent);
        const doc = ownerDocument(nodeRef.current as HTMLElement);

        doc.addEventListener(mappedTouchEvent, handleClickAway);
        doc.addEventListener("touchmove", handleTouchMove);

        return () => {
          doc.removeEventListener(mappedTouchEvent, handleClickAway);
          doc.removeEventListener("touchmove", handleTouchMove);
        };
      }

      return undefined;
    }, [handleClickAway, handleTouchMove, touchEvent]);

    React.useEffect(() => {
      // eslint-disable-next-line
      // @ts-ignore
      if (mouseEvent !== false) {
        const mappedMouseEvent = mapEventPropToEvent(mouseEvent);
        const doc = ownerDocument(nodeRef.current as HTMLElement);

        doc.addEventListener(mappedMouseEvent, handleClickAway);

        return () => {
          doc.removeEventListener(mappedMouseEvent, handleClickAway);
        };
      }

      return undefined;
    }, [handleClickAway, mouseEvent]);

    const Wrapper = (
      <div role="presentation" onClick={handleClickIn}>
        {children}
      </div>
    );

    return <React.Fragment>{React.cloneElement(Wrapper, { ref: handleRef })}</React.Fragment>;
  },
);
