function nextGeneration() {
  // console.log('next generation');
  calculateFitness();
  oldList.sort(function(a, b) {
    return a.fitness - b.fitness;
  });
  oldList.reverse();
  fit = 0;
  for (let i = 0; i < robots; i++) {
    console.log(oldList[i].fitness);
  }
  for (let i = 0; i < robots; i++) {
    if (oldList[i].score > time) {
      time = oldList[i].score;
      // console.log(time);
      // oldList[i].brain.model.save('downloads://models');
    }
    botList[i] = pickOne(oldList[i]);
  }
  for (let i = 0; i < robots; i++) {
    oldList[i].dispose();
  }
  oldList = [];
}

function pickOne(parent1) {
  let index = 0;
  let index2 = 0;
  let r = Math.random();
  let r2 = Math.random();

  // parent = new Bird(parent1.x, parent1.y, parent1.w, parent1.control, parent1.ai, parent1.brain);

  //PARENT1
  while (r > 0 && index < oldList.length) {
    r = r - oldList[index].fitness;
    index++;
  }
  index--;
  let bird = oldList[index];

  let parent = new Bird(
    bird.x,
    bird.y,
    bird.w,
    bird.color,
    bird.ai,
    bird.brain
  );

  //PARENT2
  while (r2 > 0 && index2 < oldList.length) {
    r2 = r2 - oldList[index2].fitness;
    index2++;
  }
  index2--;
  let bird2 = oldList[index2];

  // console.log(oldList[index].fitness, oldList[index2].fitness);

  let parent2 = new Bird(
    bird2.x,
    bird2.y,
    bird2.w,
    bird2.color,
    bird2.ai,
    bird2.brain
  );

  parent.crossover(parent2);

  parent.mutate();
  return parent;
}

function calculateFitness() {
  let sum = 0;
  for (let bird of oldList) {
    bird.score = Math.pow(bird.score, 4);

    sum = sum + bird.score;
  }

  for (let bird of oldList) {
    if (sum > 0) {
      bird.fitness = bird.score / sum;
    } else {
      bird.fitness = 0;
    }
  }
}
