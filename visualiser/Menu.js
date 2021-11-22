// container for the menu
class Menu {
    // creates the menu at the provided position
    constructor(x, y) {
        this.x = x;
        this.y = y;

        // spacing between the elements
        this.spacing = 5;

        // flag whether the menu is hidded atm
        this.hidden = false;

        // start y pos
        let elemY = y;

        // a parent div containing all menu elements
        this.parentDiv = createDiv('');
        this.parentDiv.style('color', '#ffffffff');
        
        // Label for Speed input field
        this.speedInputLabel = createDiv("Speed:");
        this.speedInputLabel.position(x, elemY);
        this.speedInputLabel.parent(this.parentDiv);
        elemY += this.distToNextY(this.speedInputLabel);

        // speed input field
        this.speedInput = createInput(speed, 'number');
        this.speedInput.position(x, elemY);
        this.speedInput.parent(this.parentDiv);
        this.speedInput.changed(value => speed = value.srcElement.valueAsNumber);
        elemY += this.distToNextY(this.speedInput);

        // Label for distance scale value input field
        this.distScaleInputLabel = createDiv("Distance Scale:");
        this.distScaleInputLabel.position(x, elemY);
        this.distScaleInputLabel.parent(this.parentDiv);
        elemY += this.distToNextY(this.distScaleInputLabel);

        // distance scale Input field
        this.distScaleInput = createInput(distScale, 'number');
        this.distScaleInput.position(x, elemY);
        this.distScaleInput.parent(this.parentDiv);
        this.distScaleInput.changed(value => distScale = value.srcElement.valueAsNumber);
        elemY += this.distToNextY(this.distScaleInput);

        // Label for color offset value input field
        this.colorOffsetInputLabel = createDiv("Color Offset:");
        this.colorOffsetInputLabel.position(x, elemY);
        this.colorOffsetInputLabel.parent(this.parentDiv);
        elemY += this.distToNextY(this.colorOffsetInputLabel);

        // color offset Input field
        this.colorOffsetInput = createInput(colorOffset, 'number');
        this.colorOffsetInput.position(x, elemY);
        this.colorOffsetInput.parent(this.parentDiv);
        this.colorOffsetInput.changed(value => colorOffset = value.srcElement.valueAsNumber);
        elemY += this.distToNextY(this.colorOffsetInput);

        // Label for max radius value input field
        this.maxRInputLabel = createDiv("Max Radius:");
        this.maxRInputLabel.position(x, elemY);
        this.maxRInputLabel.parent(this.parentDiv);
        elemY += this.distToNextY(this.maxRInputLabel);

        // max radius Input field
        this.maxRInput = createInput(maxRadius, 'number');
        this.maxRInput.position(x, elemY);
        this.maxRInput.parent(this.parentDiv);
        this.maxRInput.changed(value => maxRadius = value.srcElement.valueAsNumber);
        elemY += this.distToNextY(this.maxRInput);

        // Button to clear the field
        this.clearFieldButton = createButton("Clear");
        this.clearFieldButton.position(x, elemY);
        this.clearFieldButton.parent(this.parentDiv);
        this.clearFieldButton.mouseClicked(clearField);
    }

    // gets the difference to the next y position
    distToNextY(element) {
        return element.size().height + this.spacing;
    }

    toggle() {
        if (this.hidden) {
            this.parentDiv.show();
        } else {
            this.parentDiv.hide();
        }

        this.hidden = !this.hidden;
    }
}