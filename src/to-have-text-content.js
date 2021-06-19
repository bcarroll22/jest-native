import { matcherHint } from 'jest-matcher-utils';
import { pipe, is, always, reduce, concat, join, unless } from 'ramda';

import { checkReactElement, getMessage, matches, normalize } from './utils';

const unlessStringEmpty = unless(is(String), always(''));

const collectNormalizedText = pipe(collectChildrenText, join(''), normalize);

function collectChildrenText(element) {
  if (!element || !element.children) {
    return [unlessStringEmpty(element)];
  }

  return reduce((texts, child) => concat(texts, collectChildrenText(child)), [], element.children);
}

export function toHaveTextContent(element, checkWith) {
  checkReactElement(element, toHaveTextContent, this);

  const textContent = collectNormalizedText(element);

  return {
    pass: matches(textContent, checkWith),
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      return getMessage(
        matcherHint(`${this.isNot ? '.not' : ''}.toHaveTextContent`, 'element', ''),
        `Expected element ${to} have text content`,
        checkWith,
        'Received',
        textContent,
      );
    },
  };
}
