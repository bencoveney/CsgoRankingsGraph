import * as Utilities from "./utilities";

type AttributeType = { [attribute: string]: string };

export class Canvas {
  public static normalOpacity = 0.2;
  public static highlightOpacity = 1;
  public static lowlightOpacity = 0.1;
  private static svgNs = "http://www.w3.org/2000/svg";

  private static setAttributes(element: Element, attributes: AttributeType) {
    for (const attribute of Object.keys(attributes)) {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }

  private static createNsElement(name: string): Element {
    return document.createElementNS(Canvas.svgNs, name);
  }

  private definitions: Element;

  constructor(private element: Element) {
    this.resetDefinitions();
  }

  public clear(): void {
    Utilities.emptyElement(this.element);
    this.resetDefinitions();
  }

  public setDimensions(width: number, height: number): void {
    this.element.setAttribute("width", width.toString());
    this.element.setAttribute("height", height.toString());
  }

  public addText(
    value: string,
    x: number,
    y: number,
    color: string,
    fontSize: number,
    className: string,
    opacity: number,
  ) {
    const text = Canvas.createNsElement("text");

    Canvas.setAttributes(
      text,
      {
        "class": className,
        "fill": color,
        "fill-opacity": opacity.toString(),
        "font-family": "Arial",
        "font-size": fontSize.toString(),
        "text-anchor": "middle",
        "x": x.toString(),
        "y": y.toString(),
      },
    );

    text.innerHTML = value;

    this.element.appendChild(text);
  }

  public addLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number, dashes: string) {
    const line = Canvas.createNsElement("line");

    Canvas.setAttributes(
      line,
      {
        "stroke": color,
        "stroke-dasharray": dashes,
        "stroke-width": width.toString(),
        "x1": x1.toString(),
        "x2": x2.toString(),
        "y1": y1.toString(),
        "y2": y2.toString(),
      },
    );

    this.element.appendChild(line);
  }

  public createLinearGradient(
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    startColor: string,
    startOpacity: number,
    stopColor: string,
    stopOpacity: number,
  ) {
    // Add a new gradient to the definitions.
    const gradient = Canvas.createNsElement("linearGradient");
    Canvas.setAttributes(
      gradient,
      {
        "id": id,
        "x1": x1.toString(),
        "x2": x2.toString(),
        "y1": y1.toString(),
        "y2": y2.toString(),
      },
    );
    this.definitions.appendChild(gradient);

    // Create the transparent gradient stop.
    const topStop = Canvas.createNsElement("stop");
    Canvas.setAttributes(
      topStop,
      {
        "offset": "0%",
        "stop-color": startColor,
        "stop-opacity": startOpacity.toString(),
      },
    );
    gradient.appendChild(topStop);

    // Create the solid gradient stop.
    const bottomStop = Canvas.createNsElement("stop");
    Canvas.setAttributes(
      bottomStop,
      {
        "offset": "100%",
        "stop-color": stopColor,
        "stop-opacity": stopOpacity.toString(),
      },
    );
    gradient.appendChild(bottomStop);
  }

  public addCurve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number,
    name: string,
    softness: number,
  ): void {
    // Add the curve.
    let pathDefinition = `M ${x1} ${y1} C ${x1 + softness} ${y1}, ${x2 - softness} ${y2}, ${x2} ${y2}`;

    // Create the curve element.
    const line = Canvas.createNsElement("path");
    Canvas.setAttributes(
      line,
      {
        "class": `curve curve-${name}`,
        "d": pathDefinition,
        "fill": "none",
        "stroke": color,
        "stroke-opacity": Canvas.normalOpacity.toString(),
        "stroke-width": width.toString(),
      },
    );
    this.bindListeners(line, name);
    this.element.appendChild(line);
  }

  public addCurveRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    opacity:
    number,
    name: string,
  ) {
    const rect = Canvas.createNsElement("rect");

    Canvas.setAttributes(
      rect,
      {
        "class": "curve curve-" + name,
        "fill": color,
        "fill-opacity": opacity.toString(),
        "height": height.toString(),
        "width": width.toString(),
        "x": x.toString(),
        "y": y.toString(),
      },
    );
    this.bindListeners(rect, name);
    this.element.appendChild(rect);
  }

  public addRect(x: number, y: number, width: number, height: number, color: string) {
    const rect = Canvas.createNsElement("rect");

    Canvas.setAttributes(
      rect,
      {
        fill: color,
        height: height.toString(),
        width: width.toString(),
        x: x.toString(),
        y: y.toString(),
      },
    );

    this.element.appendChild(rect);
  }

  private resetDefinitions(): void {
    // Add a definitions section to the graph for gradient declarations.
    this.definitions = Canvas.createNsElement("defs");
    this.element.appendChild(this.definitions);

    const styles = Canvas.createNsElement("style");
    styles.setAttribute("type", "text/css");
    styles.innerHTML = `
<![CDATA[
  .clicked {
    stroke-opacity: 1;
    fill-opacity: 1;
  }
]]>`;
    this.definitions.appendChild(styles);
  }

  // Binds an event listener to the specified element.
  private bindListeners(element: Element, name: string): void {
    element.addEventListener("click", () => this.toggleFocus(name));
    element.addEventListener("mouseout", () => this.removeHighlight(name));
    element.addEventListener("mouseover", () => this.addHighlight(name));
  }

  // Adds the highlight for the specified curve.
  private addHighlight(teamName: string) {
    this.changeOpacity(`.curve.curve-${teamName}`, Canvas.highlightOpacity);
    this.changeOpacity(`.curve:not(.curve-${teamName})`, Canvas.lowlightOpacity);
  }

  // Removes the highlight for the specified curve.
  private removeHighlight(teamName: string) {
    this.changeOpacity(".curve", Canvas.normalOpacity);
  }

  // Toggles focus on the specified curve.
  private toggleFocus(teamName: string) {
    const allClicked = document.querySelectorAll(".curve-" + teamName);
    [].forEach.call(allClicked, (path: Element) => {
      path.classList.toggle("clicked");
    });
  }

  // Changes the opacity for all elements matching the selector.
  private changeOpacity(selector: string, opacity: number) {
    const targets = document.querySelectorAll(selector);
    [].forEach.call(targets, (path) => {
      path.setAttribute("stroke-opacity", opacity);
      path.setAttribute("fill-opacity", opacity);
    });
  }
}
