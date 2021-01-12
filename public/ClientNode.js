class ClientNode {
    constructor(xpos, ypos, zpos, id, index) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.zpos = zpos;
        this.id = id;
        this.index = index;
        this.message = '';

        this.sendMessage = false;


        this.receivedMessage = '';
        this.messageCopy = '';
        this.displayReceivedMessage = false;
        this.messageCopyIndex = this.message.length - 1;

        this.receivedMessageData = []; // obj ( msg & clientNode index)
        this.receivedMessagesCopy = []; // msg only
        this.receivedMessagesCopyIndices = []; // keeping track of indices
        this.distancesFromReceivedNode = []; // keeping track of distances
        this.charDeletionNums = [];
        this.charPushedNums = [];
        this.interruptFlags = [];
    }

    modifyCopiedMessage() {
        var indexTracker = 0;
        var fontMult = 1.0;
        try {
            for (let i = 0; i < this.receivedMessagesCopy.length; i++) {
                indexTracker = i;
                // if the received message is longer than the distance
                if (textWidth(this.receivedMessageData[i].msg) > this.distancesFromReceivedNode[i]) {
                    //console.log("LONGER; LEN:" +  this.distancesFromReceivedNode[i] + "COPY LEN: " + textWidth(this.receivedMessagesCopy[i]));
                    // *str-*
                    if (textWidth(this.receivedMessagesCopy[i]) < this.distancesFromReceivedNode[i] && !this.interruptFlags[i]) {
                        this.receivedMessagesCopy[i] =
                            this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                        this.receivedMessagesCopyIndices[i]--;
                        this.charPushedNums[i]++;
                    }
                    // *stri*
                    else {
                        this.interruptFlags[i] = true;
                        // if there are characters of the original message to copy left
                        if (this.receivedMessagesCopyIndices[i] >= 0) {

                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] =
                                this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                            this.receivedMessagesCopyIndices[i]--;
                        }
                        // if the original text is finished displaying and blanks need to be filled
                        else if (this.charPushedNums[i] >= 0) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];

                            this.charPushedNums[i]--;
                        }
                        // else delete 
                        else {
                            this.receivedMessagesCopy.splice(i, 1);
                            this.receivedMessagesCopyIndices.splice(i, 1);
                            this.receivedMessageData.splice(i, 1);
                            this.charDeletionNums.splice(i, 1);
                            this.charPushedNums.splice(i, 1);
                            this.distancesFromReceivedNode.splice(i, 1);
                            this.interruptFlags.splice(i, 1);
                        }
                    }
                }
                // if the received message is shorter than the distance
                else {
                    //console.log("SHORTER; DIST: " +  this.distancesFromReceivedNode[i] + "COPY LEN: " + textWidth(this.receivedMessagesCopy[i]));
                    // *string---*
                    if (textWidth(this.receivedMessagesCopy[i]) < this.distancesFromReceivedNode[i]) {
                        // if the original message isn't finished copying
                        if (this.receivedMessagesCopyIndices[i] >= 0) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessageData[i].msg[this.receivedMessagesCopyIndices[i]] + this.receivedMessagesCopy[i];
                            this.receivedMessagesCopyIndices[i]--;
                            this.charDeletionNums[i]++;
                        }
                        // is finished copying and needs blanks
                        else {
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];
                        }
                    }
                    // *---string*
                    else {
                        // start slicing copied message from the right and push it with blanks
                        if (this.charDeletionNums[i] >= 0) {
                            this.receivedMessagesCopy[i] =
                                this.receivedMessagesCopy[i].slice(0, this.receivedMessagesCopy[i].length - 1);
                            this.receivedMessagesCopy[i] = " " + this.receivedMessagesCopy[i];
                            this.charDeletionNums[i]--;
                        }
                        // else delete
                        else {
                            this.receivedMessagesCopy.splice(i, 1);
                            this.receivedMessagesCopyIndices.splice(i, 1);
                            this.receivedMessageData.splice(i, 1);
                            this.charDeletionNums.splice(i, 1);
                            this.charPushedNums.splice(i, 1);
                            this.distancesFromReceivedNode.splice(i, 1);
                            this.interruptFlags.splice(i, 1);
                        }
                    }
                }
                /* for debug
                push();
                noFill();
                stroke(255);
                rect(0, 0,  this.distancesFromReceivedNode[i], 10);
                rect(0, 20, textWidth(this.receivedMessagesCopy[i]), 10);
                fill(255);
                text(this.receivedMessagesCopy[i], 0, 40);
                pop();
                */
            }
        } catch (err) {
            // gets triggered when users exit before all the message strings are processed
            console.log("ERR LOG");
            this.receivedMessagesCopy.splice(indexTracker, 1);
            this.receivedMessagesCopyIndices.splice(indexTracker, 1);
            this.receivedMessageData.splice(indexTracker, 1);
            this.charDeletionNums.splice(indexTracker, 1);
            this.charPushedNums.splice(indexTracker, 1);
            this.distancesFromReceivedNode.splice(indexTracker, 1);
            this.interruptFlags.splice(indexTracker, 1);
        }

    }

    display() {
        noStroke();
        fill(255);
        push();
        translate(this.xpos, this.ypos, this.zpos)
        sphere(12, 12, 10);

        if (typeof this.id !== "undefined" &&
            typeof clientIndex !== "undefined") {
            if (clientIndex == this.index) {
                rotateX(-frameCount * 0.01);
                fill(200, 50, 180);
                text("YOUR ID: " + this.id.toString(), -130, -20);
            }
        }
        pop();
    }
}