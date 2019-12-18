import { AfterViewChecked, Directive, ElementRef, Input } from '@angular/core';

/**
 * Do line clamp via JS instead CSS because isn't supported by all browsers (only webkit).
 * By default, will clamp down by two lines (design specs), but you can send via input other number of lines.
 * The ellipsis will be '...' by default but is ready to receive other string with other string.
 * Example:
 * <h3 exoLineClamp [lines]="1" ellipsis="-.-">Random text to cut by lines</h3>
 * or
 * <p class="random-text" exoLineClamp>Random text by default will clamp by 2 lines</p>
 * Wrapper for angular from https://github.com/yuanqing/line-clamp with some changes.
 */
@Directive({
  selector: '[exoLineClamp]'
})
export class LineClampDirective implements AfterViewChecked {
  @Input() lines = 2; // Two lines is the default line clamp for whole platform.
  @Input() ellipsis = '\u2026'; // '...'
  maxHeight: number;

  constructor(
    private el: ElementRef
  ) { }

  setPropertyMaxHeight(rootElement): void {
    // If the element hasn't lineHeight defined or is "normal", we will take fontSize * 1.5.
    if (isNaN(parseInt(window.getComputedStyle(rootElement).getPropertyValue('line-height'), 10))) {
      this.maxHeight = this.lines *
        parseInt(window.getComputedStyle(rootElement).getPropertyValue('font-size'), 10) * 1.5;
    } else {
      this.maxHeight = this.lines *
        parseInt(window.getComputedStyle(rootElement).getPropertyValue('line-height'), 10);
    }
  }

  ngAfterViewChecked() {
    const rootElement = this.el.nativeElement;
    rootElement.style.cssText += 'overflow:hidden;overflow-wrap:break-word;word-wrap:break-word';

    this.setPropertyMaxHeight(rootElement);

    // Exit if text doesn't overflow the rootElement
    if (rootElement.offsetHeight <= this.maxHeight) {
      return false;
    }

    // Need to refresh the page, doesn't work fine if i remove cause sometimes calculate the height bad.
    setTimeout(() => {
      this.truncateElementNode(rootElement, rootElement);
    }, 0);
  }

  truncateElementNode(element, rootElement) {
    const childNodes = element.childNodes;
    let nodesLenght = childNodes.length - 1;
    while (nodesLenght > -1) {
      const childNode = childNodes[nodesLenght--];
      const nodeType = childNode.nodeType;
      // https://developer.mozilla.org/es/docs/Web/API/Node/nodeType
      // ELEMENT_NODE or TEXT_NODE
      if ((nodeType === 1 && this.truncateElementNode(childNode, rootElement)) ||
        (nodeType === 3 && this.truncateTextNode(childNode, rootElement))) {
        return true;
      }
      element.removeChild(childNode);
    }
    return false;
  }

  truncateTextNode(textNode, rootElement) {
    let lastIndexOfWhitespace;
    let textContent = textNode.textContent;

    while (textContent.length > 1) {
      lastIndexOfWhitespace = textContent.lastIndexOf(' ');
      if (lastIndexOfWhitespace === -1) {
        break;
      }

      textNode.textContent = textContent.substring(0, lastIndexOfWhitespace);
      if (rootElement.offsetHeight <= this.maxHeight) {
        textNode.textContent = textContent;
        break;
      }

      textContent = textNode.textContent;
    }

    return this.truncateTextNodeByCharacter(textNode, rootElement);
  }

  truncateTextNodeByCharacter(textNode, rootElement) {
    // Use to remove this characters
    const TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX = /[ .,;!?'‘’“”\-–—]+$/;

    let textContent = textNode.textContent;
    let length = textContent.length;

    while (length > 1) {
      textContent = textContent
        .substring(0, length - 1)
        .replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');

      length = textContent.length;
      textNode.textContent = textContent + this.ellipsis;
      if (rootElement.offsetHeight <= this.maxHeight) {
        return true;
      }
    }
    return false;
  }

}
