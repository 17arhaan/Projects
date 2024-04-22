import cv2
import os
def save_face(face, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    count = len(os.listdir(save_dir))
    filename = os.path.join(save_dir, f'face_{count}.jpg')
    cv2.imwrite(filename, face)
def Cam():
    video_capture = cv2.VideoCapture(0)
    previous_frame = None
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    while True:
        ret, frame = video_capture.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        if previous_frame is None:
            previous_frame = gray
            continue
        frame_diff = cv2.absdiff(previous_frame, gray)
        threshold = 30
        _, thresh = cv2.threshold(frame_diff, threshold, 255, cv2.THRESH_BINARY)
        thresh = cv2.dilate(thresh, None, iterations=2)
        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for contour in contours:
            if cv2.contourArea(contour) < 1000:
                flag = 1
                continue
            (x, y, w, h) = cv2.boundingRect(contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
            face = frame[y:y+h, x:x+w]
            save_face(face, 'FaceSearch/')
        cv2.imshow('Motion Detection', frame)
        previous_frame = gray
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    video_capture.release()
    cv2.destroyAllWindows()
def main():
    Cam()
if __name__ == "__main__":
    main()