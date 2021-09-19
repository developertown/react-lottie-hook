import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LottieApp from "./Lottie";

const story = {
  title: "Lottie/Default",
  component: LottieApp,
  argTypes: {},
} as ComponentMeta<typeof LottieApp>;

export default story;

const Template: ComponentStory<typeof LottieApp> = (args) => <LottieApp {...args} />;

export const Default = Template.bind({});
Default.args = {};
