import type { Personality } from "@/types";

export function renderBadgeToDataUrl(personality: Personality): string {
  const canvas = document.createElement("canvas");
  const W = 1000;
  const H = 1250;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b0e14");
  bg.addColorStop(1, "#10141d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ambient glow
  const glow = ctx.createRadialGradient(W / 2, 380, 50, W / 2, 380, 480);
  glow.addColorStop(0, personality.color + "33");
  glow.addColorStop(1, personality.color + "00");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Ring
  const cx = W / 2, cy = 400, r = 220;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.88);
  ctx.strokeStyle = personality.color;
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  // Emoji
  ctx.font = "160px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(personality.emoji, cx, cy);

  // "YOU ARE"
  ctx.fillStyle = "#9ba3b4";
  ctx.font = "600 28px Inter, sans-serif";
  ctx.fillText("YOU ARE", cx, cy + 300);

  // Title
  ctx.fillStyle = "#edeff3";
  ctx.font = "800 56px Sora, sans-serif";
  ctx.fillText(personality.title.toUpperCase(), cx, cy + 370);

  // Tagline
  ctx.fillStyle = personality.color;
  ctx.font = "italic 30px Sora, sans-serif";
  wrapText(ctx, `"${personality.tagline}"`, cx, cy + 440, 780, 40);

  // Footer branding
  ctx.fillStyle = "#5c6577";
  ctx.font = "600 24px Sora, sans-serif";
  ctx.fillText("MrWiseDrive — We recommend cars, not regrets.", cx, H - 60);

  return canvas.toDataURL("image/png");
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, curY);
      line = word + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
}

export function downloadBadge(personality: Personality) {
  const url = renderBadgeToDataUrl(personality);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mrwisedrive-${personality.key}.png`;
  a.click();
}
