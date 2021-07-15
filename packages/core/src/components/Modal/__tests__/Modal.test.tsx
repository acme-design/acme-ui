import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Modal, { classes } from '../Modal';

const testId = 'test-modal';

describe('Modal', () => {
  mountTestSuite(
    <Modal data-testid={testId} visible>
      modal
    </Modal>,
  );

  describe('render correctly with default props', () => {
    test('should render a default modal', () => {
      const { getByTestId } = render(
        <Modal data-testid={testId} visible>
          default modal
        </Modal>,
      );
      const modal = getByTestId(testId);
      expect(modal).toHaveClass(classes.root);
    });

    test('should render a single modal with event', () => {
      const TestModal = () => {
        const [visible, setVisible] = React.useState(false);
        const handleOpen = () => setVisible(true);
        const handleClose = () => setVisible(false);
        return (
          <div>
            <button type="button" onClick={handleOpen}>
              打开Modal
            </button>
            <Modal data-testid={testId} visible={visible} onClose={handleClose}>
              <div>
                <h2>title</h2>
                <p>description</p>
              </div>
            </Modal>
          </div>
        );
      };
      const { getByTestId, getByRole } = render(<TestModal />);

      const openBtn = getByRole('button');
      userEvent.click(openBtn);

      const modal = getByTestId(testId);
      expect(modal).toHaveClass(classes.root);

      expect(modal).toBeInTheDocument();
    });
  });

  // describe('render correctly with other props', () => {});

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();
      render(
        <Modal ref={elementRef} visible>
          modal ref using createRef
        </Modal>,
      );
      expect(elementRef.current).toBeInTheDocument();
      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const modalRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };
      render(
        <Modal ref={modalRefCallback} visible>
          modal ref with using callback
        </Modal>,
      );
      expect(elementRef).toBeInTheDocument();
      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);
        return (
          <Modal ref={elementRef} visible>
            modal ref using useRef
          </Modal>
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
