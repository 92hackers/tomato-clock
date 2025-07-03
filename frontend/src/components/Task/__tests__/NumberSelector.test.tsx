import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NumberSelector } from '../NumberSelector';

describe('NumberSelector', () => {
  const defaultProps = {
    value: 4,
    min: 1,
    max: 20,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
    label: '预计番茄数',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the component with label and value', () => {
    render(<NumberSelector {...defaultProps} />);

    expect(screen.getByText('预计番茄数')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /减少/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /增加/i })).toBeInTheDocument();
  });

  it('should call onIncrement when + button is clicked', () => {
    render(<NumberSelector {...defaultProps} />);

    const incrementButton = screen.getByRole('button', { name: /增加/i });
    fireEvent.click(incrementButton);

    expect(defaultProps.onIncrement).toHaveBeenCalledTimes(1);
  });

  it('should call onDecrement when - button is clicked', () => {
    render(<NumberSelector {...defaultProps} />);

    const decrementButton = screen.getByRole('button', { name: /减少/i });
    fireEvent.click(decrementButton);

    expect(defaultProps.onDecrement).toHaveBeenCalledTimes(1);
  });

  it('should disable decrement button when value is at minimum', () => {
    render(<NumberSelector {...defaultProps} value={1} />);

    const decrementButton = screen.getByRole('button', { name: /减少/i });
    expect(decrementButton).toBeDisabled();
  });

  it('should disable increment button when value is at maximum', () => {
    render(<NumberSelector {...defaultProps} value={20} />);

    const incrementButton = screen.getByRole('button', { name: /增加/i });
    expect(incrementButton).toBeDisabled();
  });

  it('should not disable buttons when value is between min and max', () => {
    render(<NumberSelector {...defaultProps} value={10} />);

    const decrementButton = screen.getByRole('button', { name: /减少/i });
    const incrementButton = screen.getByRole('button', { name: /增加/i });

    expect(decrementButton).not.toBeDisabled();
    expect(incrementButton).not.toBeDisabled();
  });

  it('should apply correct CSS classes', () => {
    render(<NumberSelector {...defaultProps} />);

    const container = screen.getByText('预计番茄数').closest('.form-group');
    expect(container).toHaveClass('form-group');

    const numberInput = screen.getByText('4').closest('.number-input');
    expect(numberInput).toHaveClass('number-input');

    const decrementButton = screen.getByRole('button', { name: /减少/i });
    const incrementButton = screen.getByRole('button', { name: /增加/i });

    expect(decrementButton).toHaveClass('number-button');
    expect(incrementButton).toHaveClass('number-button');
  });

  it('should display custom label when provided', () => {
    render(<NumberSelector {...defaultProps} label="自定义标签" />);

    expect(screen.getByText('自定义标签')).toBeInTheDocument();
  });

  it('should support keyboard navigation', () => {
    render(<NumberSelector {...defaultProps} />);

    const decrementButton = screen.getByRole('button', { name: /减少/i });
    const incrementButton = screen.getByRole('button', { name: /增加/i });

    // Test tab navigation
    decrementButton.focus();
    expect(decrementButton).toHaveFocus();

    fireEvent.keyDown(decrementButton, { key: 'Tab' });
    // In normal browser behavior, focus would move to next element

    // Test Enter key activation
    fireEvent.keyDown(decrementButton, { key: 'Enter' });
    expect(defaultProps.onDecrement).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(incrementButton, { key: 'Enter' });
    expect(defaultProps.onIncrement).toHaveBeenCalledTimes(1);
  });

  it('should handle edge case with value below minimum', () => {
    render(<NumberSelector {...defaultProps} value={0} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /减少/i })).toBeDisabled();
  });

  it('should handle edge case with value above maximum', () => {
    render(<NumberSelector {...defaultProps} value={25} />);
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /增加/i })).toBeDisabled();
  });
}); 