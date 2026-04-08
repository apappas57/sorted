#!/usr/bin/env python3
"""Generate OG image, favicon, and apple-touch-icon for Sorted."""

from PIL import Image, ImageDraw, ImageFont
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Brand colors
GREEN = (22, 163, 74)       # #16A34A
WHITE = (255, 255, 255)
LIGHT_GREEN = (220, 252, 231)
SUBTLE_GREEN = (200, 255, 220)
DARK_ACCENT = (18, 140, 62)

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"


def generate_og_image():
    """Create 1200x630 OG image for social sharing."""
    width, height = 1200, 630
    img = Image.new("RGB", (width, height), GREEN)
    draw = ImageDraw.Draw(img)

    # Gradient background (darker at bottom)
    for y in range(height):
        factor = y / height
        r = int(GREEN[0] * (1 - factor * 0.3))
        g = int(GREEN[1] * (1 - factor * 0.15))
        b = int(GREEN[2] * (1 - factor * 0.3))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Load fonts
    title_font = ImageFont.truetype(FONT_BOLD, 96)
    tagline_font = ImageFont.truetype(FONT_BOLD, 42)
    desc_font = ImageFont.truetype(FONT_REGULAR, 30)
    badge_font = ImageFont.truetype(FONT_BOLD, 20)
    sub_font = ImageFont.truetype(FONT_REGULAR, 24)
    domain_font = ImageFont.truetype(FONT_BOLD, 24)
    dollar_font = ImageFont.truetype(FONT_BOLD, 200)

    left_pad = 80
    y_cursor = 120

    # Badge: "FREE & OPEN SOURCE"
    badge_text = "FREE & OPEN SOURCE"
    bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
    badge_w = bbox[2] - bbox[0] + 32
    badge_h = bbox[3] - bbox[1] + 16
    draw.rounded_rectangle(
        [left_pad, y_cursor, left_pad + badge_w, y_cursor + badge_h],
        radius=badge_h // 2,
        outline=WHITE,
        width=2,
    )
    draw.text((left_pad + 16, y_cursor + 5), badge_text, fill=WHITE, font=badge_font)
    y_cursor += badge_h + 40

    # Title
    draw.text((left_pad, y_cursor), "Sorted", fill=WHITE, font=title_font)
    y_cursor += 110

    # Tagline
    draw.text((left_pad, y_cursor), "Your money, sorted.", fill=LIGHT_GREEN, font=tagline_font)
    y_cursor += 70

    # Horizontal rule
    draw.line([(left_pad, y_cursor), (left_pad + 120, y_cursor)], fill=WHITE, width=3)
    y_cursor += 30

    # Description
    draw.text((left_pad, y_cursor), "Free AI financial navigator for Australians", fill=WHITE, font=desc_font)
    y_cursor += 50

    # Sub-description
    draw.text((left_pad, y_cursor), "No signup. No fees. No data stored.", fill=SUBTLE_GREEN, font=sub_font)

    # Domain bottom-right
    draw.text((width - 260, height - 55), "imsorted.au", fill=SUBTLE_GREEN, font=domain_font)

    # Decorative dollar sign
    draw.text((850, 280), "$", fill=DARK_ACCENT, font=dollar_font)

    path = os.path.join(BASE_DIR, "public", "og-image.png")
    img.save(path, "PNG", quality=95)
    print(f"OG image saved: {path} ({os.path.getsize(path)} bytes)")


def generate_favicon():
    """Create branded green S favicon."""
    sizes = [16, 32, 48]
    icons = []
    for size in sizes:
        icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        icon_draw = ImageDraw.Draw(icon)
        padding = max(1, size // 16)
        icon_draw.rounded_rectangle(
            [padding, padding, size - padding - 1, size - padding - 1],
            radius=size // 4,
            fill=GREEN,
        )
        s_font = ImageFont.truetype(FONT_BOLD, int(size * 0.65))
        bbox = icon_draw.textbbox((0, 0), "S", font=s_font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        x = (size - text_w) // 2 - bbox[0]
        y = (size - text_h) // 2 - bbox[1]
        icon_draw.text((x, y), "S", fill=WHITE, font=s_font)
        icons.append(icon)

    path = os.path.join(BASE_DIR, "src", "app", "favicon.ico")
    icons[0].save(path, format="ICO", sizes=[(s, s) for s in sizes], append_images=icons[1:])
    print(f"Favicon saved: {path} ({os.path.getsize(path)} bytes)")


def generate_apple_touch_icon():
    """Create 180x180 apple-touch-icon."""
    size = 180
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    icon_draw = ImageDraw.Draw(icon)
    icon_draw.rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=size // 5,
        fill=GREEN,
    )
    font = ImageFont.truetype(FONT_BOLD, int(size * 0.6))
    bbox = icon_draw.textbbox((0, 0), "S", font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1]
    icon_draw.text((x, y), "S", fill=WHITE, font=font)

    path = os.path.join(BASE_DIR, "public", "apple-touch-icon.png")
    icon.save(path, "PNG")
    print(f"Apple touch icon saved: {path} ({os.path.getsize(path)} bytes)")


if __name__ == "__main__":
    generate_og_image()
    generate_favicon()
    generate_apple_touch_icon()
    print("Done!")
