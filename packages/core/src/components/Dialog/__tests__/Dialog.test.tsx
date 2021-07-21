import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Dialog, { classes } from '../Dialog';

const testId = 'test-dialog';

describe('Dialog', () => {
  mountTestSuite(
    <Dialog data-testid={testId} visible>
      dialog
    </Dialog>,
  );

  describe('render correctly with default props', () => {
    test('should render a default dialog', () => {
      const { getByTestId } = render(
        <Dialog data-testid={testId} visible>
          default dialog
        </Dialog>,
      );
      const dialog = getByTestId(testId);
      expect(dialog).toHaveClass(classes.root);
    });

    test('should render a single dialog with event', () => {
      const mockCloseCbFn = jest.fn();
      const mockBackdropCbFn = jest.fn();

      const TestDialog = () => {
        const [visible, setVisible] = React.useState(false);
        const handleOpen = () => setVisible(true);
        const handleClose = () => {
          mockCloseCbFn();
          setVisible(false);
        };
        return (
          <div>
            <button type="button" onClick={handleOpen}>
              Open Dialog
            </button>
            <Dialog
              data-testid={testId}
              visible={visible}
              title="title"
              onClose={handleClose}
              onBackdropClick={mockBackdropCbFn}
            >
              body
            </Dialog>
          </div>
        );
      };
      const { getByTestId, getByRole } = render(<TestDialog />);

      // open dialog
      const openBtn = getByRole('button');
      userEvent.click(openBtn);

      const dialog = getByTestId(testId);
      expect(dialog).toHaveClass(classes.root);

      expect(dialog).toBeInTheDocument();

      const dialogInner = getByRole('dialog');
      userEvent.click(dialogInner);
      expect(dialog).toBeInTheDocument();

      // close dialog
      const backdrop = getByTestId('acme-test-dialog-container');
      userEvent.click(backdrop);

      expect(dialog).not.toBeInTheDocument();
      expect(mockCloseCbFn).toBeCalledTimes(1);
      expect(mockBackdropCbFn).toBeCalledTimes(1);
    });
  });

  describe('render correctly with other props', () => {
    test('should render a single dialog with keepMounted', () => {
      const TestDialog = () => {
        const [visible, setVisible] = React.useState(false);
        const handleOpen = () => setVisible(true);
        const handleClose = () => setVisible(false);
        return (
          <div>
            <button type="button" onClick={handleOpen}>
              Open Dialog
            </button>
            <Dialog data-testid={testId} visible={visible} keepMounted onClose={handleClose}>
              body
            </Dialog>
          </div>
        );
      };
      const { getByTestId, getByRole } = render(<TestDialog />);

      // open dialog
      const openBtn = getByRole('button');
      userEvent.click(openBtn);

      const dialog = getByTestId(testId);
      expect(dialog).toBeInTheDocument();

      // close dialog
      const backdrop = getByTestId('acme-test-dialog-container');
      userEvent.click(backdrop);

      expect(dialog).toBeInTheDocument();
      expect(dialog).not.toBeVisible();
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();
      render(
        <Dialog ref={elementRef} visible>
          dialog ref using createRef
        </Dialog>,
      );
      expect(elementRef.current).toBeInTheDocument();
      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const dialogRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };
      render(
        <Dialog ref={dialogRefCallback} visible>
          dialog ref with using callback
        </Dialog>,
      );
      expect(elementRef).toBeInTheDocument();
      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);
        return (
          <Dialog ref={elementRef} visible>
            dialog ref using useRef
          </Dialog>
        );
      };
      await waitFor(() => {
        render(<Test />);
      });
      expect(elementRef.current).toBeInTheDocument();
      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
  });
});
