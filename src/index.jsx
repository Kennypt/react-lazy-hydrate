import React, {
  createReactClass,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const LazyHydrate = createReactClass({
  displayName: 'LazyHydrate',
  render: ({ children, isStatic }) => {
    const ref = useRef(null);
    const [shouldRender, setShouldRender] = useState(
      typeof window === 'undefined'
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
      }

      // Render if urgent (user in view)
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

      if (currentRef) {
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
      return <section>{children}</section>;
    }

    // avoid re-render on the client
    // eslint-disable-next-line react/no-danger
    return (
      <section
        ref={ref}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: '' }}
      />
    );
  }
});

LazyHydrate.propTypes = {
    children: PropTypes.node.isRequired,
    isStatic: PropTypes.bool,
};

LazyHydrate.defaultProps = {
    isStatic: false,
};

export default LazyHydrate;
