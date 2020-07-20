<h1 align="center">Welcome to react-lazy-hydrate 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%5E12.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/yarn-%5E1.12.0-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

React component to do progressive/partial hydration.

The objective of this component is to delay the hydration on client side from SSR applications, in order to increase TTI performance until this is natively supported by react (not lazy load a component).

## Install

```sh
yarn add react-lazy-hydrate
```

## Props

- `children`: Element to be progressive/partially hydrated
- `isStatic`: If the element is static, avoid hydration

## Usage

### Progressive hydration

Progressive hydration is achieved by delaying the hydration when the web application goes into idle mode, but it has an intersection observer that if the component is visible by the user, then it hydrates the component immediately (urgent).

```html
  <ReactLazyHydrate>
    <Component />
  </ReactLazyHydrate>
```

### Partial hydration

If the user has a static content that is rendered on server side and it does not change on client side no matter what the user does, and it does not have any js animations/interactions, like text, then there is no need to hydrate the component, for that you should add the prop `isStatic`.

**NOTE:** This does not remove the child component from the virtual DOM!

```html
  <ReactLazyHydrate isStatic>
    <StaticContent />
  </ReactLazyHydrate>
```



## Author

👤 **KennyPT <ricardo.rocha.pinheiro@gmail.com>**

* Github: [@kennypt](https://github.com/kennypt)

## Show your support

Give a ⭐️ if this project helped you!
