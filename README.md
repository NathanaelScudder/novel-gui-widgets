# web-gui-widgets

<p>Posted for the purpose of showcasing previous coursework using TypeScript and SVG.js to build GUI widgets. This project was completed alone.</p>

<p>This project was partially received as starter code, where included the following files:</p>
<ul>
    <li>grid.ts</li>
    <li>ui.ts</li>
</ul>

## Functionality

<ul>
    <li>Select one of the three radio buttons to draw a shape to the center rectangle area, whether that be a "Rectangle," "Circle," or "Ellipse." Selecting a different radio button will remove the current shape and draw a new shape of the selected type.</li>
    <li>Selecting one or multiple of the checkboxes will change the color of the selected shape. When selecting multiple colors, the shape's color will be a combination of the selected colors. If you select the checkboxes first, when you select a shape it will take on the colors already selected.</li>
    <li>Once a shape is drawn, you can click and drag the center circle of the "Object Control" widget to move the shape around the center rectangular area. The shape will not leave the area, regardless of direction and speed. Dragging the controller closer to the edge of its boundaries will cause the object to become faster in the desired direction.</li>
    <li>Clicking the "Reset" button will move any drawn object back to the center of the rectangular area.</li>
</ul>

## Instructions


<p>Ensure webpack and typescript are installed.</p>

```bash
npm install webpack webpack-cli --save-dev
```

```bash
npm install typescript ts-loader --save-dev
```

<p>Navgiate to the project directory in the command-line, then run:</p>

```bash
npm install
# then
npm run watch 
```

<p>Lastly, open index.html from the dist directory using your web-browser.</p>