// Optional macOS authoring tool. The generated PNGs are committed; CI needs no Swift.
import AppKit

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let portraitURL = root.appendingPathComponent("_p/miao-portrait-watercolor.jpg")
guard let portrait = NSImage(contentsOf: portraitURL) else { fatalError("Missing stylized portrait") }

func color(_ hex: UInt32, alpha: CGFloat = 1) -> NSColor {
    NSColor(srgbRed: CGFloat((hex >> 16) & 255) / 255,
            green: CGFloat((hex >> 8) & 255) / 255,
            blue: CGFloat(hex & 255) / 255, alpha: alpha)
}
func text(_ string: String, x: CGFloat, top: CGFloat, width: CGFloat, height: CGFloat,
          size: CGFloat, ink: NSColor, canvasHeight: CGFloat, tracking: CGFloat = 0,
          fontName: String = "PingFangSC-Regular") {
    let font = NSFont(name: fontName, size: size) ?? NSFont.systemFont(ofSize: size)
    (string as NSString).draw(in: NSRect(x: x, y: canvasHeight - top - height, width: width, height: height),
                              withAttributes: [.font: font, .foregroundColor: ink, .kern: tracking])
}
func render(width: Int, height: Int, filename: String, square: Bool) {
    let size = NSSize(width: width, height: height)
    guard let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width, pixelsHigh: height,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0),
        let context = NSGraphicsContext(bitmapImageRep: bitmap) else { fatalError("Cannot allocate image") }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = context
    let bounds = NSRect(origin: .zero, size: size)
    let h = CGFloat(height)
    NSGradient(starting: color(0x07191e), ending: color(0x24434d))!.draw(in: bounds, angle: 90)
    // A restrained lake horizon, drawn rather than copied from a photographic background.
    for row in 0..<10 {
        let path = NSBezierPath()
        let y = CGFloat(row) * (square ? 13 : 18) + (square ? 10 : 14)
        path.move(to: NSPoint(x: -30, y: y))
        path.curve(to: NSPoint(x: size.width + 20, y: y + 7),
                   controlPoint1: NSPoint(x: size.width * 0.32, y: y + 19),
                   controlPoint2: NSPoint(x: size.width * 0.68, y: y - 12))
        color(0xa8c5c4, alpha: 0.045 + CGFloat(row % 3) * 0.01).setStroke()
        path.lineWidth = 1
        path.stroke()
    }
    let frame = square
        ? NSRect(x: 188, y: 192, width: 224, height: 298)
        : NSRect(x: 818, y: 78, width: 298, height: 398)
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(roundedRect: frame, xRadius: 20, yRadius: 20).addClip()
    portrait.draw(in: frame, from: NSRect(origin: .zero, size: portrait.size), operation: .sourceOver, fraction: 0.94)
    NSGraphicsContext.restoreGraphicsState()
    color(0xc8d9d2, alpha: 0.16).setStroke()
    let outline = NSBezierPath(roundedRect: frame, xRadius: 20, yRadius: 20)
    outline.lineWidth = 1
    outline.stroke()
    if square {
        text("MIAO", x: 175, top: 50, width: 270, height: 74, size: 57, ink: color(0xf1f0e4),
             canvasHeight: h, tracking: 10, fontName: "HelveticaNeue-Light")
        text("产品经理", x: 226, top: 425, width: 180, height: 42, size: 30, ink: color(0xe9ecdf), canvasHeight: h)
        text("AI 交互 · Agent 工作流", x: 125, top: 485, width: 390, height: 35, size: 24,
             ink: color(0xb9cdc9), canvasHeight: h)
    } else {
        text("PRODUCT / PORTFOLIO", x: 84, top: 76, width: 650, height: 32, size: 16,
             ink: color(0xa9c1be), canvasHeight: h, tracking: 4, fontName: "HelveticaNeue")
        text("MIAO", x: 78, top: 134, width: 650, height: 116, size: 88, ink: color(0xf1f0e4),
             canvasHeight: h, tracking: 15, fontName: "HelveticaNeue-Light")
        text("产品经理", x: 84, top: 278, width: 650, height: 54, size: 37,
             ink: color(0xe9ecdf), canvasHeight: h)
        text("AI 交互  /  Agent 工作流", x: 86, top: 347, width: 650, height: 45, size: 29,
             ink: color(0xc2d2cc), canvasHeight: h)
        text("把 AI 能力，变成可交付的产品体验。", x: 86, top: 432, width: 680, height: 40, size: 23,
             ink: color(0xb0c4c1), canvasHeight: h)
        text("作品与项目 · 交互式个人网站", x: 87, top: 548, width: 650, height: 30, size: 17,
             ink: color(0x94b1ac), canvasHeight: h, tracking: 1)
    }
    NSGraphicsContext.restoreGraphicsState()
    guard let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("Cannot encode PNG") }
    try! png.write(to: root.appendingPathComponent("_p/\(filename)"))
    print("Generated \(filename), \(width)×\(height), \(png.count) bytes")
}
render(width: 1200, height: 630, filename: "miao-share-card.png", square: false)
render(width: 600, height: 600, filename: "miao-share-card-square.png", square: true)
