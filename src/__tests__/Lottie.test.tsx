import { render, act, fireEvent, RenderResult } from "@testing-library/react";
import React from "react";
import { Lottie } from "../Lottie";
import { LottieProps } from "../../dist/index.cjs";

const spyOnClick = jest.fn();

interface Props {
  options: Omit<LottieProps, "lottieRef">;
}

const Component: React.FC<Props> = ({ options = {} }) => {
  const lottieRef = React.useRef(null);
  return <Lottie lottieRef={lottieRef} width={200} height={200} {...options} />;
};

interface CustomRender {
  title: string;
  ref: React.MutableRefObject<HTMLElement | null> | null;
}

interface CustromRenderResult extends RenderResult {
  lottieRef: React.MutableRefObject<HTMLElement | null> | null;
}

const customRender = ({ title, ref }: CustomRender): CustromRenderResult => {
  const result = render(
    <Lottie lottieRef={ref as React.MutableRefObject<HTMLElement | null>} width={200} height={200} title={title} />,
  );
  return {
    ...result,
    lottieRef: ref,
  };
};

describe("Lottie", () => {
  describe("props", () => {
    it("sets ariaLabel, ariaRole and title propertly", () => {
      const options = {
        ariaLabel: "test-label",
        ariaRole: "test",
        title: "aria test",
      };
      const { getByRole, getByLabelText, getByTitle } = render(<Component options={options} />);
      expect(getByRole(options.ariaRole)).toBeInTheDocument();
      expect(getByLabelText(options.ariaLabel)).toBeInTheDocument();
      expect(getByTitle(options.title)).toBeInTheDocument();
    });

    it("sets the dimensions height and width correctly", () => {
      const title = "dimension-test";
      const { getByTitle } = render(<Component options={{ title }} />);
      expect(getByTitle(title)).toHaveStyle("width: 200px");
      expect(getByTitle(title)).toHaveStyle("height: 200px");
    });

    it("has tab index prop set to 0", () => {
      const title = "dimension-test";
      const { getByTitle } = render(<Component options={{ title }} />);
      expect(getByTitle(title)).toHaveAttribute("tab-index", "0");
    });

    it("registers onClick event when clicked", async () => {
      const title = "dimension-test";
      const { getByTitle } = render(<Component options={{ title, onClick: spyOnClick }} />);
      await act(async () => {
        fireEvent.click(getByTitle(title));
      });
      expect(spyOnClick).toHaveBeenCalled();
      expect(spyOnClick).toHaveBeenCalledTimes(1);
    });

    it("sets styles correctly", () => {
      const title = "dimension-test";
      const prop = { style: { backgroundColor: "#171717" } };
      const { getByTitle } = render(<Component options={{ title, ...prop }} />);
      expect(getByTitle(title)).toHaveStyle("background-color: rgb(23, 23, 23)");
    });

    it("sets className correctly", () => {
      const title = "dimension-test";
      const prop = { className: "test-className" };
      const { getByTitle } = render(<Component options={{ title, ...prop }} />);
      expect(getByTitle(title)).toHaveClass(prop.className);
    });

    it("sets onKeyDown correctly", async () => {
      const title = "dimension-test";
      const prop = { onKeyDown: jest.fn() };
      const { getByTitle } = render(<Component options={{ title, ...prop }} />);
      const input = { key: "Enter", code: 13 };
      await act(async () => {
        fireEvent.keyDown(getByTitle(title), input);
      });
      expect(prop.onKeyDown).toHaveBeenCalled();
      expect(prop.onKeyDown).toHaveBeenCalledTimes(1);
    });

    it("missing lottieRef triggers error", () => {
      const title = "dimension-test";
      const error = new Error("Lottie component requires a valid ref but got: null");
      const renderer = (): CustromRenderResult => customRender({ title, ref: null });
      expect(renderer).toThrow(error);
    });
  });
});
