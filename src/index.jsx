import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import isBrowser from './utils/isBrowser';

// No bg, borders or paddings from wrapper
const wrapperStyle = { display: 'contents' };
const isOnBrowser = isBrowser();

const LazyHydrate = ({
    children,
    isStatic,
    wrapperComponent,
    wrapperComponentProps,
    onHydrationRender,
  }) => {
    const ref = useRef(null);
    const [shouldRender, setShouldRender] = useState(
      !isOnBrowser // Should render if SSR
    );

    useEffect(() => {
      const currentRef = ref.current;
      if (isStatic && currentRef && currentRef.innerHTML !== '') {
        return () => {};
      }

      // Should only render the component if cpu on idle or the user is on view, whatever comes first
      let handleIdleCallback;
      let iObs;

      // Render on idle
      if (window.requestIdleCallback) {
        handleIdleCallback = window.requestIdleCallback(() => {
          if (shouldRender) {
            // already rendered by intersection observer
            window.cancelIdleCallback(handleIdleCallback);
            return;
          }

          if (iObs && currentRef) {
            iObs.unobserve(currentRef);
          }

          setShouldRender(true);
        });
      } else {
        console.warn('react-lazy-hydrate: "requestIdleCallback" polyfill missing');
      }

      // Render if urgent (user in view)
      if (window.IntersectionObserver) {
        iObs = new window.IntersectionObserver(async ([entry], obs) => {
          if (!entry.isIntersecting && !shouldRender) {
            return;
          }

          obs.unobserve(currentRef);

          if (shouldRender) {
            // Already rendered by request idle callback
            return;
          }

          if (handleIdleCallback && window.cancelIdleCallback) {
            window.cancelIdleCallback(handleIdleCallback);
          }

          // Its urgent, going to render
          setShouldRender(true);
        });
      } else {
        console.warn('react-lazy-hydrate: "IntersectionObserver" polyfill missing');
      }

      if (currentRef && iObs) {
        iObs.observe(currentRef);
      }

      return () => {
        if (iObs && currentRef) {
          iObs.unobserve(currentRef);
        }

        if (handleIdleCallback && window.cancelIdleCallback) {
          window.cancelIdleCallback(handleIdleCallback);
        }
      };
    }, [shouldRender, isStatic]);

    // if we're in the server or a spa navigation, just render it
    if (shouldRender) {
      if (onHydrationRender && isOnBrowser) {
        onHydrationRender();
      }

      return React.createElement(
        wrapperComponent,
        {
          style: wrapperStyle,
          ...wrapperComponentProps
        },
        children
      );
    }

    // avoid re-render on the client
    // eslint-disable-next-line react/no-danger
    return React.createElement(
      wrapperComponent,
      {
        style: wrapperStyle,
        ref,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: '' },
        ...wrapperComponentProps
      }
    );
  };

LazyHydrate.propTypes = {
    children: PropTypes.node.isRequired,
    isStatic: PropTypes.bool,
    wrapperComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    wrapperComponentProps: PropTypes.object,
    onHydrationRender: PropTypes.func,
};

LazyHydrate.defaultProps = {
    isStatic: false,
    wrapperComponent: 'section',
    wrapperComponentProps: {},
};

export default LazyHydrate;
