
---

# Guyy - Pygame Animation Project

A fun, interactive project that uses Pygame to animate a stick-figure character with a more realistic face. The animated guy reacts to commands entered via an on-screen textbox. You can make him wave, jump, blink, dance, spin, smile, frown, sneeze, or even "speak" any custom text.

## Features

- **Realistic Face:**  
  The figure's face features a skin-colored head, white eyes with pupils, eyebrows, a nose, and an expressive mouth that can change to a smile or frown.

- **Multiple Animations:**  
  - **Wave:** The figure waves its arm.
  - **Jump:** The figure jumps up and comes back down.
  - **Blink:** The figure blinks by briefly hiding its eyes.
  - **Dance:** The figure dances side-to-side.
  - **Spin:** The figure rotates around its center.
  - **Smile/Frown:** The figure displays a smile or a frown.
  - **Sneeze:** The figure sneezes, temporarily closing its eyes and showing "Achoo!" above its head.
  - **Speak:** Any unrecognized command is displayed as a speech bubble.

- **Interactive Textbox:**  
  A dedicated, clickable textbox at the bottom of the window allows you to type in your commands. When active, the box highlights, and you can enter your desired animation command.

## Requirements

- Python 3.x
- Pygame

## Installation

1. **Clone or Download the Repository:**

   ```bash
   git clone https://github.com/17arhaan/Guyy.git
   cd animated-guy
   ```

2. **Install Pygame:**

   ```bash
   pip install pygame
   ```

   *(Optionally, set up a virtual environment before installing.)*

## Running the Project

To run the project, execute the Python script:

```bash
python main.py
```

This will open a Pygame window displaying the animated figure along with the textbox for input.

## How to Use

1. **Activate the Textbox:**  
   Click inside the textbox (displayed at the bottom of the window). The border will turn blue to indicate that it is active.

2. **Type a Command:**  
   Enter one of the following commands (or any custom text):
   - `wave`
   - `jump`
   - `blink`
   - `dance`
   - `spin`
   - `smile`
   - `frown`
   - `sneeze`
   - *Any other text* (the figure will "speak" it by displaying a speech bubble)

3. **Submit the Command:**  
   Press **Enter** to trigger the corresponding animation.

## Customization

- **Modifying Animations:**  
  All animations and the figure's appearance are controlled by the `AnimatedGuy` class in `main.py`. Feel free to adjust parameters (such as the animation speed, face features, or movement) to suit your creative vision.

- **Enhancements:**  
  You can extend the project by adding new animations or refining existing ones. Experiment with Pygame's drawing functions to further improve the visual quality of the character.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
