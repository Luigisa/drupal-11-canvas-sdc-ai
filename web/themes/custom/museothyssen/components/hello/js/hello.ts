/**
 * @file
 * Behavior del componente museothyssen:hello.
 */

import { toggleDataState } from "@utils/dom";

((Drupal, once) => {
  Drupal.behaviors.museothyssenHello = {
    attach(context: HTMLElement): void {
      once("museothyssen-hello", ".museothyssen-hello", context).forEach(
        (root) => {
          const toggle = root.querySelector<HTMLButtonElement>(
            "[data-hello-toggle]",
          );
          const subtitle = root.querySelector<HTMLElement>(
            ".museothyssen-hello__subtitle",
          );
          if (!toggle || !subtitle) {
            return;
          }

          toggle.addEventListener("click", () => {
            const expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            subtitle.hidden = expanded;
            toggleDataState(root, "subtitle-collapsed", expanded);
          });
        },
      );
    },
  };
})(Drupal, once);
