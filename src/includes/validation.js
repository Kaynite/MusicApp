import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", Form);
    app.component("VeeField", Field);
    app.component("ErrorMessage", ErrorMessage);
    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minValue);
    defineRule("max_value", maxValue);
    defineRule("confirmed", confirmed);

    configure({
      generateMessage(ctx) {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          email: `The field ${ctx.field} must be a valid email.`,
          tos: "You must accept the Terms of service.",
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The ${ctx.field} is invalid.`;

        return message;
      },
    });
  },
};
