let array = [];
let maxSize;

// Define Queue function  
 function Queue(array, maxSize) {
   this.array = [];
   if (array) this.array = array;
   this.maxSize = maxSize;
 }

 // Add Get Buffer property to object constructor 
 // which slices the array 
 Queue.prototype.getBuffer = function() {
   return this.array.slice();
 }

 Queue.prototype.getSize = function() {
   return this.array.length;
 }

// Add isEmpty properties to object constructor which 
 // returns the length of the array 
 Queue.prototype.isEmpty = function() {
   return this.array.length == 0;
 }

 // Add Push property to object constructor  
 // which push elements to the array 
 Queue.prototype.enqueue = function(value) {
   this.array.push(value);
   // console.log("this.array.length: " + this.array.length + "\tmaxSize: " + this.maxSize); 
   if(this.array.length > this.maxSize) {
      this.array.shift();
   }     
 }

 // Peek Function 
 Queue.prototype.peek = function() {
   return this.array[this.array.length - 1];
 }

