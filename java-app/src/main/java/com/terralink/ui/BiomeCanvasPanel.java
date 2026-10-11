package com.terralink.ui;

import com.terralink.model.UserProfile;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.*;

/**
 * Java Swing GUI component: Living Urban Biome Canvas.
 * Renders the SDG 13 ecological landscape using Graphics2D vector drawing.
 */
public class BiomeCanvasPanel extends JPanel {
    private final UserProfile user;

    public BiomeCanvasPanel(UserProfile user) {
        this.user = user;
        setPreferredSize(new Dimension(800, 240));
        setBackground(new Color(240, 253, 250));
        setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(229, 231, 235)));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // Sky gradient
        GradientPaint skyGradient = new GradientPaint(
                0, 0, new Color(224, 242, 254),
                0, h, new Color(209, 250, 229)
        );
        g2.setPaint(skyGradient);
        g2.fillRect(0, 0, w, h);

        // Sun
        g2.setColor(new Color(251, 191, 36));
        g2.fillOval(w - 90, 25, 48, 48);
        g2.setColor(new Color(253, 230, 138, 120));
        g2.fillOval(w - 98, 17, 64, 64);

        // Rolling Green Hills
        g2.setColor(new Color(167, 243, 208));
        g2.fillArc(-50, h - 160, w + 100, 260, 0, 180);

        g2.setColor(new Color(110, 231, 183));
        g2.fillArc(w / 4, h - 140, w, 220, 0, 180);

        // Foreground Meadow Ground
        g2.setColor(new Color(52, 211, 153));
        g2.fillRect(0, h - 60, w, 60);

        // Clean River
        g2.setColor(new Color(56, 189, 248));
        GeneralPath river = new GeneralPath();
        river.moveTo(w * 0.45, h);
        river.curveTo(w * 0.52, h - 35, w * 0.58, h - 50, w * 0.65, h - 60);
        river.lineTo(w * 0.72, h - 60);
        river.curveTo(w * 0.64, h - 45, w * 0.58, h - 25, w * 0.52, h);
        river.closePath();
        g2.fill(river);

        // Stage-based Oak Tree
        int treeX = w / 3;
        int treeBaseY = h - 55;

        // Trunk
        g2.setColor(new Color(120, 53, 15));
        g2.fillRect(treeX - 10, treeBaseY - 60, 20, 60);

        // Foliage Layers
        g2.setColor(new Color(4, 120, 87));
        g2.fillOval(treeX - 45, treeBaseY - 110, 90, 70);

        g2.setColor(new Color(5, 150, 105));
        g2.fillOval(treeX - 35, treeBaseY - 130, 70, 60);

        g2.setColor(new Color(16, 185, 129));
        g2.fillOval(treeX - 25, treeBaseY - 140, 50, 45);

        // Informational overlay badge
        g2.setColor(new Color(15, 23, 42, 200));
        g2.fillRoundRect(16, 16, 260, 50, 10, 10);
        g2.setColor(Color.WHITE);
        g2.setFont(new Font("SansSerif", Font.BOLD, 12));
        g2.drawString("LIVING URBAN BIOME · STAGE " + user.getLevel(), 26, 35);
        g2.setFont(new Font("SansSerif", Font.PLAIN, 11));
        g2.setColor(new Color(167, 243, 208));
        g2.drawString("Total Avoided: " + String.format("%.1f kg CO₂e", user.getTotalSavedKg()), 26, 52);

        g2.dispose();
    }
}
