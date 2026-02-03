import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('@tremor/react', () => ({
  BarChart: () => null,
  LineChart: () => null,
  DonutChart: () => null,
  Card: ({ children }) => children,
  Divider: () => null,
  List: ({ children }) => children,
  ListItem: ({ children }) => children,
  Table: () => null,
  TableBody: () => null,
  TableCell: () => null,
  TableHead: () => null,
  TableHeaderCell: () => null,
  TableRow: () => null,
}));

test('renders homepage with Monthly Expense link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Monthly Expense/i);
  expect(linkElement).toBeInTheDocument();
});
