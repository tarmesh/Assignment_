// Min-Heap implementation for task sorting (to be implemented)
class MinHeap {
  constructor() {
      this.heap = [];
  }

  insert(task) {
      this.heap.push(task);
      this.heapifyUp();
  }

  heapifyUp() {
      let index = this.heap.length - 1;
      while (index > 0) {
          let parentIndex = Math.floor((index - 1) / 2);
          if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
          [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
          index = parentIndex;
      }
  }

  extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();
      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
      return min;
  }

  heapifyDown() {
      let index = 0;
      while (true) {
          let leftChild = 2 * index + 1;
          let rightChild = 2 * index + 2;
          let smallest = index;

          if (leftChild < this.heap.length && this.heap[leftChild].priority < this.heap[smallest].priority) {
              smallest = leftChild;
          }
          if (rightChild < this.heap.length && this.heap[rightChild].priority < this.heap[smallest].priority) {
              smallest = rightChild;
          }
          if (smallest === index) break;
          [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
          index = smallest;
      }
  }
}

module.exports = MinHeap;