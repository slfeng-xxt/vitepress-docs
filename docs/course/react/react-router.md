# React-Router

[React Router v6.21.1 中文文档](https://baimingxuan.github.io/react-router6-doc/)

## 1. 基本使用

### 1.1 安装

```shell
npm install react-router-dom
```

### 1.2 定义路由

createBrowserRouter： 创建一个路由器实例

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'page1',
        element: <Page1 />,
      },
      {
        path: 'page2',
        element: <Page2 />,
      },
    ],
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}
```

### 1.3 路由跳转

**Link**：它是一个 React 组件，用于在应用程序中创建链接。它接受一个 `to` 属性，该属性指定链接的目标 URL。当用户点击链接时，Link 组件将使用 React Router 的导航功能来更新应用程序的当前 URL，并渲染相应的组件。

```jsx
import { Link } from 'react-router-dom'

function Page1() {
  return (
    <div>
      <h1>Page1</h1>
      <Link to="/page2">to page2</Link>
    </div>
  )
}
```

**Navigate**：它是一个 React 组件，用于在应用程序中导航到另一个页面。它接受一个 `to` 属性，该属性指定目标页面的 URL。当组件被渲染时，Navigate 组件将使用 React Router 的导航功能来更新应用程序的当前 URL，并渲染相应的组件。

```jsx
import { Navigate } from 'react-router-dom'

function Page1() {
  return (
    <div>
      <h1>Page1</h1>
      <button onClick={() => {

        // 跳转到 page2
        navigate('/page2')

        // 跳转到 page2，并替换当前 history 记录
        navigate('/page2', { replace: true })

        // 跳转到 page2，并添加到 history 记录
        navigate('/page2', { state: { from: 'page1' } })

      }}>to page2</button>
    </div>
  )
}}
```

### 1.4 获取路由信息

获取路由信息的方式有：useParams、useLocation、useNavigate

**useParams**：它是一个 React Hook，用于获取当前路由的参数。它返回一个对象，其中包含当前路由的所有参数。
应用场景：当路由路径中包含参数时，可以使用 useParams 来获取这些参数的值。

```jsx
import { useParams } from 'react-router-dom'

function Page2() {
  const params = useParams()
  return (
    <div>
      <h1>Page2</h1>
      <p>{params.id}</p>
    </div>
  )
}
```

**useLocation**：它是一个 React Hook，用于获取当前路由的位置信息。它返回一个对象，其中包含当前路由的 URL、路径名、搜索参数等。
应用场景：当需要获取当前路由的 URL 或路径名时，可以使用 useLocation。

```jsx
import { useLocation } from 'react-router-dom'

function Page2() {
  const location = useLocation()
  return (
    <div>
      <h1>Page2</h1><p>{location.state.from}</p>
    </div>
  )
}
```

**useNavigate**：它是一个 React Hook，用于在应用程序中导航到另一个页面。它返回一个函数，该函数接受一个 URL 或一个路径名作为参数，并使用 React Router 的导航功能来更新应用程序的当前 URL，并渲染相应的组件。
应用场景：当需要使用编程方式导航到另一个页面时，可以使用 useNavigate。

```jsx
import { useNavigate } from 'react-router-dom'

function Page2() {
  const navigate = useNavigate()
  return (
    <div>
      <h1>Page2</h1>
      <button onClick={() => {
        navigate(-1)
      }}>back</button>
    </div>
  )
}
```

## 2. 常见的几种路由模式

react-router-dom 提供了`createBrowserRouter`、`createHashRouter`、`createMemoryRouter`、`createStaticRouter` 四种路由模式，其中`createBrowserRouter`是默认的路由模式。

- BrowserRouter：使用 HTML5 的 history API 来管理路由。它会在浏览器地址栏中显示完整的 URL，并且可以与服务器端渲染（SSR）一起使用。这是 React Router 的默认路由模式。
- HashRouter：使用 URL 的 hash 部分（即 URL 中 # 后面的部分）来管理路由。它会在浏览器地址栏中显示带有 # 的 URL，并且可以与服务器端渲染（SSR）一起使用。
- MemoryRouter：将路由状态保存在内存中，而不是在浏览器的历史记录中。它不会改变浏览器地址栏中的 URL，并且可以用于测试和开发。
- StaticRouter：用于服务器端渲染（SSR）。它接受一个 location 参数，该参数指定当前路由的位置。它会在服务器端渲染应用程序时使用，并且不会改变浏览器地址栏中的 URL。

## 3. 常用hooks

- useRoutes：它是一个 React Hook，用于根据路由配置渲染路由。它接受一个路由配置对象作为参数，并返回一个 React 元素，该元素包含根据路由配置渲染的组件。
- useNavigate：它是一个 React Hook，用于在应用程序中导航到另一个页面。它返回一个函数，该函数接受一个 URL 或一个路径名作为参数，并使用 React Router 的导航功能来更新应用程序的当前 URL，并渲染相应的组件。
- useParams：它是一个 React Hook，用于获取当前路由的参数。它返回一个对象，其中包含当前路由的所有参数。
- useLocation：它是一个 React Hook，用于获取当前路由的位置信息。它返回一个对象，其中包含当前路由的 URL、路径名、搜索参数等。
- useMatch：它是一个 React Hook，用于获取当前路由的匹配信息。它返回一个对象，其中包含当前路由的路径名、参数、是否匹配等。

## 4. 常见组件

- RouterProvider：它是一个 React 组件，用于提供路由器实例。它接受一个 router 属性，该属性指定要使用的路由器实例。它应该在应用程序的顶层组件中使用，以便在整个应用程序中提供路由器实例。
- Link：它是一个 React 组件，用于在应用程序中创建链接。它接受一个 to 属性，该属性指定链接的目标 URL。当用户点击链接时，Link 组件将使用 React Router 的导航功能来更新应用程序的当前 URL，并渲染相应的组件。
- Navigate：它是一个 React 组件，用于在应用程序中导航到另一个页面。它接受一个 to 属性，该属性指定目标页面的 URL。当组件被渲染时，Navigate 组件将使用 React Router 的导航功能来更新应用程序的当前 URL，并渲染相应的组件。
- Outlet：它是一个 React 组件，用于渲染当前路由的子路由。它应该在父路由的组件中使用，以便渲染子路由的组件。
- Route：它是一个 React 组件，用于定义路由。它接受一个 path 属性，该属性指定路由的路径。它还接受一个 element 属性，该属性指定当路由匹配时要渲染的组件。
- Routes：它是一个 React 组件，用于定义一组路由。它接受一个 children 属性，该属性指定一组 Route 组件。它应该在 RouterProvider 组件中使用，以便提供路由器实例。

## 5. 原理解析

源码大致实现流程：首先，通过`createBrowserRouter`创建一个路由器实例，然后通过`RouterProvider`组件提供路由器实例，最后通过`Link`组件和`Navigate`组件实现路由跳转。

## 6. 简单实现一个react-router

- 如何监听 url 的变化
- 如何匹配 path，按什么规则
- 如何渲染对应的组件

```jsx
import { useState, useEffect } from 'react'

function useLocation() {
  const [state, setState] = useState(window.location.pathname)
  useEffect(() => {
    window.addEventListener('popstate', () => {
      setState(window.location.pathname)
    })
  }, [])
  return state
}

function useNavigate() {
  return (path) => {
    window.history.pushState(null, '', path)
  }
}

function useRoutes(routes) {
  const location = useLocation()
  const pathname = location.split('?')[0]
  const route = routes.find((route) => route.path === pathname)
  return route ? route.element : null
}

function RouterProvider({ routes }) {
  return useRoutes(routes)
}

function Link({ to, children }) {
  const navigate = useNavigate()
  return (
    <a onClick={() => navigate(to)}>{children}</a>
  )
}

function Navigate({ to }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [])
  return null
}

function Route({ path, element }) {
  return element
}

function Routes({ routes }) {
  return (
    <RouterProvider routes={routes} />
  )
}

export {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useRoutes
}
```
