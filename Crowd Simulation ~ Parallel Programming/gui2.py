import tkinter as tk
from tkinter import messagebox
import json, time, random
from threading import Thread

with open("travel_commands.json", "r") as f:
    td = {k.replace("person", ""): v for k, v in json.load(f).items()}

def fp():
    pid = ent.get()
    if pid in td:
        pd.config(text=(td[pid]).upper())
    else:
        messagebox.showerror("Error", "Not found!")

def ar():
    while True:
        for i in range(360):
            cv.delete("r")
            a = i * 3.14159 / 180
            xe = 300 + 250 * tk.cos(a)
            ye = 300 - 250 * tk.sin(a)
            cv.create_line(300, 300, xe, ye, fill="green", tags="r", width=2)
            time.sleep(0.02)

def bd():
    while True:
        cv.delete("b")
        for _ in range(10):
            x, y = random.randint(50, 550), random.randint(50, 550)
            cv.create_oval(x-3, y-3, x+3, y+3, fill="green", tags="b")
        time.sleep(0.5)

rt = tk.Tk()
rt.title("Tracker")
rt.attributes('-fullscreen', True)
rt.configure(bg='black')

cv = tk.Canvas(rt, width=600, height=600, bg="black", highlightthickness=0)
cv.place(relx=0.5, rely=0.5, anchor="center")

for i in range(1, 6):
    cv.create_oval(300 - i*100, 300 - i*100, 300 + i*100, 300 + i*100, outline="darkgreen")
cv.create_line(0, 300, 600, 300, fill="darkgreen")
cv.create_line(300, 0, 300, 600, fill="darkgreen")

Thread(target=ar, daemon=True).start()
Thread(target=bd, daemon=True).start()

fr = tk.Frame(rt, bg="black")
fr.place(relx=0.5, rely=0.5, anchor="center")

tl = tk.Label(fr, text="Tracker", font=("Arial", 16, "bold"), fg="green", bg="black")
tl.pack(pady=10)

el = tk.Label(fr, text="Enter ID:", fg="white", bg="black")
el.pack()
ent = tk.Entry(fr)
ent.pack(pady=5)

bt = tk.Button(fr, text="Find", command=fp, bg="green", fg="white")
bt.pack(pady=10)

pd = tk.Label(fr, text="", fg="yellow", bg="black", wraplength=500, justify="center")
pd.pack(pady=20)

rt.mainloop()
