import { getElementById, addEventListenerToElement, setElementText, setElementStyle } from '../src/utilities.js';

test('Ensure getElementById returns correct element', () => {
    document.body.innerHTML = '<div id="test"></div>';
    const element = getElementById('test');
    expect(element).not.toBeNull();
    expect(element.id).toBe('test');
});

test('Ensure addEventListenerToElement adds an event listener', () => {
    const element = document.createElement('button');
    const mockCallback = vi.fn();
    addEventListenerToElement(element, 'click', mockCallback);
    element.click();
    expect(mockCallback).toHaveBeenCalled();
});

test('Ensure setElementText sets the correct text content', () => {
    const element = document.createElement('div');
    setElementText(element, 'Tic Attack Toe');
    expect(element.textContent).toBe('Tic Attack Toe');
});

test('Ensure setElementStyle sets the correct style', () => {
    const element = document.createElement('div');
    setElementStyle(element, 'color', 'red');
    expect(element.style.color).toBe('red');
});
