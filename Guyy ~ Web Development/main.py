import pygame
import math

def rotate_point(point, center, angle):
    px, py = point
    cx, cy = center
    x = px - cx
    y = py - cy
    new_x = x * math.cos(angle) - y * math.sin(angle)
    new_y = x * math.sin(angle) + y * math.cos(angle)
    return (new_x + cx, new_y + cy)

class AnimatedGuy:
    def __init__(self):
        self.base_head_center = (200, 180)
        self.head_radius = 20
        self.base_body_start = (200, 200)
        self.base_body_end = (200, 300)
        self.base_left_arm_start = (200, 220)
        self.base_left_arm_end = (170, 260)
        self.base_right_arm_start = (200, 220)
        self.base_right_arm_end = (230, 260)
        self.base_left_leg_start = (200, 300)
        self.base_left_leg_end = (180, 350)
        self.base_right_leg_start = (200, 300)
        self.base_right_leg_end = (220, 350)
        self.base_right_arm_angle = math.atan2(
            self.base_right_arm_end[1] - self.base_right_arm_start[1],
            self.base_right_arm_end[0] - self.base_right_arm_start[0]
        )
        self.arm_length = math.hypot(
            self.base_right_arm_end[0] - self.base_right_arm_start[0],
            self.base_right_arm_end[1] - self.base_right_arm_start[1]
        )
        self.center = (200, 250)
        self.translation = [0, 0]
        self.rotation = 0
        self.right_arm_extra_angle = 0
        self.mouth_expression = "neutral"  # "neutral", "smile", or "frown"
        self.show_face = True  # If False, hide eyes (for blink/sneeze)
        self.speech_text = None
        self.sneeze_text = None
        self.current_animation = None
        self.animation_frame = 0
        self.wave_amplitude = 0.3
        self.smile_timer = 0
        self.speech_timer = 0
        self.sneeze_timer = 0

    def start_animation(self, command):
        if self.current_animation is not None:
            return
        if command == "wave":
            self.current_animation = "wave"
            self.animation_frame = 0
        elif command == "jump":
            self.current_animation = "jump"
            self.animation_frame = 0
        elif command == "blink":
            self.current_animation = "blink"
            self.animation_frame = 0
        elif command == "dance":
            self.current_animation = "dance"
            self.animation_frame = 0
        elif command == "spin":
            self.current_animation = "spin"
            self.animation_frame = 0
        elif command == "smile":
            self.current_animation = "smile"
            self.animation_frame = 0
            self.smile_timer = 60
            self.mouth_expression = "smile"
        elif command == "frown":
            self.current_animation = "frown"
            self.animation_frame = 0
            self.smile_timer = 60
            self.mouth_expression = "frown"
        elif command == "sneeze":
            self.current_animation = "sneeze"
            self.animation_frame = 0
        else:
            self.start_speak(command)

    def start_speak(self, text):
        self.current_animation = "speak"
        self.animation_frame = 0
        self.speech_text = text
        self.speech_timer = 120

    def update(self):
        if self.current_animation == "wave":
            self.update_wave()
        elif self.current_animation == "jump":
            self.update_jump()
        elif self.current_animation == "blink":
            self.update_blink()
        elif self.current_animation == "dance":
            self.update_dance()
        elif self.current_animation == "spin":
            self.update_spin()
        elif self.current_animation in ("smile", "frown"):
            self.update_smile()
        elif self.current_animation == "sneeze":
            self.update_sneeze()
        elif self.current_animation == "speak":
            self.update_speak()

    def update_wave(self):
        total_frames = 50
        if self.animation_frame < total_frames:
            self.right_arm_extra_angle = self.wave_amplitude * math.sin(self.animation_frame * 0.3)
            self.animation_frame += 1
        else:
            self.right_arm_extra_angle = 0
            self.current_animation = None
            self.animation_frame = 0

    def update_jump(self):
        total_frames = 20
        if self.animation_frame < 10:
            self.translation[1] = -5 * (self.animation_frame + 1)
        elif self.animation_frame < total_frames:
            self.translation[1] = -5 * (total_frames - self.animation_frame)
        else:
            self.translation[1] = 0
            self.current_animation = None
            self.animation_frame = 0
        self.animation_frame += 1

    def update_blink(self):
        if self.animation_frame == 0:
            self.show_face = True
            self.animation_frame += 1
        elif self.animation_frame == 1:
            self.show_face = False
            self.animation_frame += 1
        elif self.animation_frame == 2:
            self.show_face = True
            self.current_animation = None
            self.animation_frame = 0

    def update_dance(self):
        total_frames = 20
        self.translation[0] = 10 * math.sin(2 * math.pi * self.animation_frame / total_frames)
        self.animation_frame += 1
        if self.animation_frame >= total_frames:
            self.translation[0] = 0
            self.current_animation = None
            self.animation_frame = 0

    def update_spin(self):
        total_frames = 36
        self.rotation = 2 * math.pi * self.animation_frame / total_frames
        self.animation_frame += 1
        if self.animation_frame >= total_frames:
            self.rotation = 0
            self.current_animation = None
            self.animation_frame = 0

    def update_smile(self):
        self.smile_timer -= 1
        if self.smile_timer <= 0:
            self.mouth_expression = "neutral"
            self.current_animation = None
            self.animation_frame = 0

    def update_sneeze(self):
        if self.animation_frame == 0:
            self.show_face = False
            self.sneeze_text = "Achoo!"
            self.sneeze_timer = 30
            self.animation_frame += 1
        elif self.animation_frame == 1:
            self.sneeze_timer -= 1
            if self.sneeze_timer <= 0:
                self.show_face = True
                self.sneeze_text = None
                self.current_animation = None
                self.animation_frame = 0

    def update_speak(self):
        self.speech_timer -= 1
        if self.speech_timer <= 0:
            self.speech_text = None
            self.current_animation = None
            self.animation_frame = 0

    def transform_point(self, point):
        rp = rotate_point(point, self.center, self.rotation)
        return (rp[0] + self.translation[0], rp[1] + self.translation[1])

    def draw_face(self, surface):
        head_center = self.transform_point(self.base_head_center)
        # Draw head (skin-colored circle)
        pygame.draw.circle(surface, (255, 224, 189), (int(head_center[0]), int(head_center[1])), self.head_radius)
        # Eyes positions (more realistic)
        left_eye_center = self.transform_point((193, 175))
        right_eye_center = self.transform_point((207, 175))
        eye_w, eye_h = 10, 6
        left_eye_rect = pygame.Rect(left_eye_center[0] - eye_w/2, left_eye_center[1] - eye_h/2, eye_w, eye_h)
        right_eye_rect = pygame.Rect(right_eye_center[0] - eye_w/2, right_eye_center[1] - eye_h/2, eye_w, eye_h)
        if self.show_face:
            pygame.draw.ellipse(surface, (255, 255, 255), left_eye_rect)
            pygame.draw.ellipse(surface, (255, 255, 255), right_eye_rect)
            pygame.draw.circle(surface, (0, 0, 0), (int(left_eye_center[0]), int(left_eye_center[1])), 2)
            pygame.draw.circle(surface, (0, 0, 0), (int(right_eye_center[0]), int(right_eye_center[1])), 2)
            # Eyebrows
            le_eyebrow_start = self.transform_point((188, 168))
            le_eyebrow_end = self.transform_point((198, 168))
            re_eyebrow_start = self.transform_point((202, 168))
            re_eyebrow_end = self.transform_point((212, 168))
            pygame.draw.line(surface, (0, 0, 0), le_eyebrow_start, le_eyebrow_end, 2)
            pygame.draw.line(surface, (0, 0, 0), re_eyebrow_start, re_eyebrow_end, 2)
            # Nose
            nose_start = self.transform_point((200, 180))
            nose_end = self.transform_point((200, 186))
            pygame.draw.line(surface, (0, 0, 0), nose_start, nose_end, 2)
            # Mouth
            if self.mouth_expression == "neutral":
                m_start = self.transform_point((195, 190))
                m_end = self.transform_point((205, 190))
                pygame.draw.line(surface, (0, 0, 0), m_start, m_end, 2)
            elif self.mouth_expression == "smile":
                pts = []
                for t in [i / 20.0 for i in range(21)]:
                    x = (1 - t) ** 2 * 195 + 2 * (1 - t) * t * 200 + t ** 2 * 205
                    y = (1 - t) ** 2 * 190 + 2 * (1 - t) * t * 195 + t ** 2 * 190
                    pts.append(self.transform_point((x, y)))
                pygame.draw.aalines(surface, (0, 0, 0), False, pts, 2)
            elif self.mouth_expression == "frown":
                pts = []
                for t in [i / 20.0 for i in range(21)]:
                    x = (1 - t) ** 2 * 195 + 2 * (1 - t) * t * 200 + t ** 2 * 205
                    y = (1 - t) ** 2 * 190 + 2 * (1 - t) * t * 185 + t ** 2 * 190
                    pts.append(self.transform_point((x, y)))
                pygame.draw.aalines(surface, (0, 0, 0), False, pts, 2)

    def draw(self, surface, font):
        self.draw_face(surface)
        b_start = self.transform_point(self.base_body_start)
        b_end = self.transform_point(self.base_body_end)
        pygame.draw.line(surface, (0, 0, 0), b_start, b_end, 3)
        la_start = self.transform_point(self.base_left_arm_start)
        la_end = self.transform_point(self.base_left_arm_end)
        pygame.draw.line(surface, (0, 0, 0), la_start, la_end, 3)
        ra_start = self.transform_point(self.base_right_arm_start)
        angle = self.base_right_arm_angle + self.right_arm_extra_angle
        ra_end_x = self.base_right_arm_start[0] + self.arm_length * math.cos(angle)
        ra_end_y = self.base_right_arm_start[1] + self.arm_length * math.sin(angle)
        ra_end = self.transform_point((ra_end_x, ra_end_y))
        pygame.draw.line(surface, (0, 0, 0), ra_start, ra_end, 3)
        ll_start = self.transform_point(self.base_left_leg_start)
        ll_end = self.transform_point(self.base_left_leg_end)
        pygame.draw.line(surface, (0, 0, 0), ll_start, ll_end, 3)
        rl_start = self.transform_point(self.base_right_leg_start)
        rl_end = self.transform_point(self.base_right_leg_end)
        pygame.draw.line(surface, (0, 0, 0), rl_start, rl_end, 3)
        if self.speech_text:
            head_center = self.transform_point(self.base_head_center)
            txt = font.render(self.speech_text, True, (0, 0, 255))
            surface.blit(txt, (head_center[0] - txt.get_width() // 2, head_center[1] - 80))
        if self.sneeze_text:
            head_center = self.transform_point(self.base_head_center)
            txt = font.render(self.sneeze_text, True, (255, 0, 0))
            surface.blit(txt, (head_center[0] - txt.get_width() // 2, head_center[1] - 60))

pygame.init()
WIDTH, HEIGHT = 400, 500
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Just a Guy")
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 24)
guy = AnimatedGuy()

# Define a text box rectangle for input
text_box_rect = pygame.Rect(10, 410, WIDTH - 20, 40)
input_text = ""
active = False

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Check if mouse clicked inside the text box area.
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if text_box_rect.collidepoint(event.pos):
                active = True
            else:
                active = False
        elif event.type == pygame.KEYDOWN:
            if active:
                if event.key == pygame.K_RETURN:
                    if input_text.strip() != "":
                        guy.start_animation(input_text.strip().lower())
                    input_text = ""
                elif event.key == pygame.K_BACKSPACE:
                    input_text = input_text[:-1]
                else:
                    input_text += event.unicode
    guy.update()
    screen.fill((255, 255, 255))
    guy.draw(screen, font)
    # Draw the text box
    pygame.draw.rect(screen, (230, 230, 230), text_box_rect)
    # Draw border; highlight if active.
    border_color = (0, 0, 255) if active else (0, 0, 0)
    pygame.draw.rect(screen, border_color, text_box_rect, 2)
    # Render the input text inside the box
    txt_surface = font.render(input_text, True, (0, 0, 0))
    screen.blit(txt_surface, (text_box_rect.x + 5, text_box_rect.y + 10))
    pygame.display.flip()
    clock.tick(60)
pygame.quit()
