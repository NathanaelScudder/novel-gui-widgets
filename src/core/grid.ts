
import { Line } from '@svgdotjs/svg.js'
import { Window, Widget } from "../core/ui";

/**
 * Represents a widget in a grid layout.
 */
interface GridLayoutWidget {
    /**
     * The widget element.
     */
    element: Widget;

    /**
     * The row index of the widget in the grid. Optional.
     */
    row?: number;

    /**
     * The column index of the widget in the grid. Optional.
     */
    col?: number;
}

/**
 * Represents a grid layout manager.
 */
class GridLayoutManager {
    /**
     * The parent window object.
     * @private
     */
    private parent: Window;

    /**
     * The number of rows in the grid.
     * @private
     */
    private rows: number;

    /**
     * The number of columns in the grid.
     * @private
     */
    private cols: number;

    /**
     * The width of each grid cell.
     * @private
     */
    private cellWidth: number;

    /**
     * The height of each grid cell.
     * @private
     */
    private cellHeight: number;

    /**
     * The 2D array of grid layout widgets.
     * @private
     */
    private widgets: GridLayoutWidget[][];

    /**
     * Creates an instance of GridLayoutManager.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} cols - The number of columns in the grid.
     * @param {number} cellWidth - The width of each grid cell.
     * @param {number} cellHeight - The height of each grid cell.
     * @param {Window} parent - The parent window object.
     */
    constructor(rows: number, cols: number, cellWidth: number, cellHeight: number, parent: Window) {
        this.parent = parent;
        this.rows = rows;
        this.cols = cols;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.widgets = new Array(rows);

        for (let i = 0; i < rows; i++) {
            this.widgets[i] = new Array(cols).fill(null);
        }
    }

    /**
     * Adds a widget to the grid layout.
     * If the widget's row or column is not specified, it will be automatically assigned the next available cell.
     * @param {GridLayoutWidget} widget - The widget to add.
     */
    addWidget(widget: GridLayoutWidget): void {
        if (widget.row === undefined || widget.col === undefined) {
            const { row, col } = this.getNextAvailableCell();
            widget.row = row;
            widget.col = col;
        }

        this.widgets[widget.row][widget.col] = widget;
        this.relayout();
    }

    /**
     * Removes a widget from the grid layout.
     * @param {GridLayoutWidget} widget - The widget to remove.
     */
    removeWidget(widget: GridLayoutWidget): void {
        const { row, col } = widget;
        this.widgets[row][col] = null;
        this.relayout();
    }

    /**
     * Creates a visualization of the grid layout with grid lines.
     */
    createGridVisualization(): void {
        const xStep = this.cellWidth;
        const yStep = this.cellHeight;
        console.log("steps", xStep, yStep)

        for (let i = 0; i <= this.rows; i++) {
            this.parent.window.line(0, i * yStep, this.cols * xStep, i * yStep).stroke({ color: '#000', width: 1 });
        }
        for (let i = 0; i <= this.cols; i++) {
            this.parent.window.line(i * xStep, 0, i * xStep, this.rows * yStep).stroke({ color: '#000', width: 1 });
        }
    }

    /**
     * Gets the next available cell in the grid.
     * @private
     * @returns {Object} An object containing the row and column indices of the next available cell.
     * @throws {Error} Throws an error if the grid is full.
     */
    private getNextAvailableCell(): { row: number, col: number } {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.widgets[row][col]) {
                    return { row, col };
                }
            }
        }

        throw new Error('Grid is full');
    }

    /**
     * Relayouts the widgets in the grid.
     * @private
     */
    private relayout(): void {
        let x = 0;
        let y = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const widget = this.widgets[row][col];
                if (widget) {
                    widget.element.move(x, y);
                }
                x += this.cellWidth;
            }
            y += this.cellHeight;
            x = 0;
        }
    }
}

export { GridLayoutManager };

