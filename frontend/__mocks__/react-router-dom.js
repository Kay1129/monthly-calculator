const React = require('react');

module.exports = {
  Link: ({ to, children }) => React.createElement('a', { href: to }, children),
  useNavigate: () => jest.fn(),
  MemoryRouter: ({ children }) => React.createElement(React.Fragment, null, children),
  BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
  Routes: ({ children }) => React.createElement(React.Fragment, null, children),
  Route: (props) => React.createElement(React.Fragment, null, props.element || props.children),
};
