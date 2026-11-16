"""
Prepares Abdul's supplied assets for the website. Run from the project root:

    python scripts/prepare-assets.py

- content/images-everythingelse/*  ->  public/images/<name>.webp  (resized, compressed)
- logo/logo-black.png              ->  public/logo-navy.png, public/logo-cream.png, src/app/icon.png
- Birds of Paradise font           ->  public/wordmark-portfolio.png (rasterized "Portfolio" wordmark;
                                       the font's personal-use license allows rasterized use, so the
                                       font file itself is not shipped)
- Code 7x5 font                    ->  src/fonts/Code7x5.ttf
"""
import os, shutil
from PIL import Image, ImageDraw, ImageFont

SRC = "content/images-everythingelse"
OUT = "public/images"
NAVY = (43, 64, 102)
CREAM = (236, 220, 184)

# source file name (without extension, as supplied) -> web name
NAMES = {
    "174584670_517573826047927_4646527909807833937_n 1": "illustration-danny-zee",
    "AURA 25%": "gourmet-aura",
    "AXIS 25%": "gourmet-axis",
    "Asset 2@4x 6": "logo-slice",
    "Asset 2@4x 7": "logo-bonappetit",
    "Asset 2@4x 8": "logo-fleur",
    "Asset 5@4x 1": "logo-abdul",
    "Asset 7@4x 1": "logo-sunny-villa",
    "CIVIC 1": "illustration-civic",
    "CLAUDIA 25%": "gourmet-claudia-bed",
    "CLAUDIA CHAIR": "gourmet-claudia-chair",
    "CLAUDIA STUDY TABLE 14": "gourmet-14-august",
    "COVE DINING 30%": "gourmet-cove-dining",
    "COVE-AI 3": "genai-cove-1",
    "COVE-AI2 1": "genai-cove-2",
    "DOORS-Ai2 1": "genai-doors",
    "DOORS": "gourmet-doors",
    "Fleur": "fleur-packaging",
    "Gemini_Generated_Image_8vp0p8vp0p8vp0p8 1": "genai-axis-table",
    "Gemini_Generated_Image_an3zosan3zosan3z 1": "genai-round-tables",
    "Gemini_Generated_Image_d5utn1d5utn1d5ut 1": "genai-arch-dining",
    "Gemini_Generated_Image_w0r0sxw0r0sxw0r0 1": "genai-desk",
    "Generated Image September 21, 2025 - 3_24PM 1": "genai-trolley",
    "Generated Image September 26, 2025 - 2_26PM 1": "genai-trolley-model",
    "Generated Image September 29, 2025 - 10_00PM 1": "genai-door-garden",
    "Generated Image September 29, 2025 - 10_11PM 1": "genai-living-room",
    "Generated Image September 29, 2025 - 9_46PM 1": "genai-library",
    "Group 11": "rishtay-button-pressed",
    "Group 13": "rishtay-button-disabled",
    "Group 15": "rishtay-email-code",
    "Group 16": "rishtay-email",
    "Group 18": "rishtay-home",
    "Group 22": "rishtay-welcome",
    "Group 23": "rishtay-interests",
    "Group 24": "rishtay-photo-empty",
    "Group 25": "rishtay-photo",
    "Group 26": "rishtay-signup",
    "Group 27": "rishtay-about-you",
    "Group 28": "rishtay-privacy",
    "Group 29": "rishtay-ready",
    "Group 30": "rishtay-profile",
    "Group 36": "rishtay-button-default",
    "Group 48": "imc-team",
    "Group 56": "art-pen",
    "Group 57": "art-oil-dragons",
    "Group 58": "art-oil-ocean",
    "Group 59": "art-pencil-portraits",
    "Group 60": "art-pencil-studies",
    "Group 8": "rishtay-mockup",
    "LUNA CHAIR 4": "gourmet-luna-chair",
    "MAISON-AI 1": "genai-maison-bed",
    "NEXA CHAIR": "gourmet-nexa-chair",
    "Purple Rishtay logo@4x 3": "rishtay-logo",
    "R34 1": "illustration-r34",
    "VENOM 1": "illustration-venom",
    "imc-laptop 1": "imc-laptop",
    "mediaclub mockup 1": "imc-mockup",
    "mehran 1": "illustration-mehran",
    "will-smith 1": "illustration-portrait",
    "white-paper-texture 4": "texture-paper",
}

os.makedirs(OUT, exist_ok=True)
done = 0
for file in os.listdir(SRC):
    stem, ext = os.path.splitext(file)
    if "tape paper texture" in stem:
        stem_name = "texture-tape"
    else:
        stem_name = NAMES.get(stem)
    if not stem_name:
        continue  # small decorative vectors etc. are not needed
    im = Image.open(os.path.join(SRC, file))
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    max_w = 1100 if stem_name == "fleur-packaging" else 1400
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    elif im.height > 1600 and stem_name != "fleur-packaging":
        im = im.resize((round(im.width * 1600 / im.height), 1600), Image.LANCZOS)
    im.save(os.path.join(OUT, stem_name + ".webp"), quality=84, method=6)
    done += 1
print("images:", done)


def tint(source, color, size):
    """Recolors a transparent logo using its alpha channel."""
    im = Image.open(source).convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())  # trim the empty margin around the mark
    im.thumbnail((size, size), Image.LANCZOS)
    out = Image.new("RGBA", im.size, color + (0,))
    out.putalpha(im.getchannel("A"))
    return out


tint("logo/logo-black.png", NAVY, 512).save("public/logo-navy.png")
tint("logo/logo-black.png", CREAM, 512).save("public/logo-cream.png")

icon = Image.new("RGBA", (256, 256), CREAM + (255,))
mark = tint("logo/logo-black.png", NAVY, 190)
icon.alpha_composite(mark, ((256 - mark.width) // 2, (256 - mark.height) // 2))
icon.save("src/app/icon.png")

# "Portfolio" wordmark, rasterized from Birds of Paradise
font_dir = "fonts/birds_of_paradise"
font_file = [f for f in os.listdir(font_dir) if f.lower().endswith(".ttf")][0]
font = ImageFont.truetype(os.path.join(font_dir, font_file), 220)
text = "Portfolio"
box = font.getbbox(text)
pad = 30
word = Image.new("RGBA", (box[2] - box[0] + pad * 2, box[3] - box[1] + pad * 2), NAVY + (0,))
ImageDraw.Draw(word).text((pad - box[0], pad - box[1]), text, font=font, fill=NAVY + (255,))
word.save("public/wordmark-portfolio.png")
print("wordmark:", word.size)

os.makedirs("src/fonts", exist_ok=True)
shutil.copyfile("fonts/code_7x5/Code 7x5.ttf", "src/fonts/Code7x5.ttf")
print("done")
