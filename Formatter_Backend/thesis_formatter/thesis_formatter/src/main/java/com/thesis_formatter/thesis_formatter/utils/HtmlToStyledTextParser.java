package com.thesis_formatter.thesis_formatter.utils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

import java.util.ArrayList;
import java.util.List;

public class HtmlToStyledTextParser {

    // Prevent instantiation
    private HtmlToStyledTextParser() {
    }

    public static class StyledText {
        public String text;
        public boolean bold = false;
        public boolean italic = false;

        public StyledText(String text, boolean bold, boolean italic) {
            this.text = text;
            this.bold = bold;
            this.italic = italic;
        }
    }

    public enum ListType {NONE, UL, OL}

    public static List<StyledText> parseHtml(String html) {
        Element body = Jsoup.parse(html).body();
        List<StyledText> result = new ArrayList<>();
        traverse(body, false, false, result, ListType.NONE, 0);
        return result;
    }

    private static void traverse(Node node, boolean isBold, boolean isItalic, List<StyledText> result,
                                 ListType currentListType, int itemIndex) {

        if (node instanceof TextNode) {
            String text = ((TextNode) node).text();
            if (!text.trim().isEmpty()) {
                result.add(new StyledText(text, isBold, isItalic));
            }
        }

        for (Node child : node.childNodes()) {
            boolean bold = isBold || child.nodeName().equalsIgnoreCase("strong") || child.nodeName().equalsIgnoreCase("b");
            boolean italic = isItalic || child.nodeName().equalsIgnoreCase("em") || child.nodeName().equalsIgnoreCase("i");

            switch (child.nodeName().toLowerCase()) {
                case "ol":
                    int olIndex = 0;
                    for (Node olChild : child.childNodes()) {
                        if (olChild.nodeName().equalsIgnoreCase("li")) {
                            String prefix = (olIndex + 1) + ". ";
                            result.add(new StyledText("\n" + prefix, false, false));
                            traverse(olChild, bold, italic, result, ListType.OL, olIndex + 1);
                            olIndex++;
                        } else {
                            traverse(olChild, bold, italic, result, ListType.OL, olIndex);
                        }
                    }
                    break;
                case "ul":
                    for (Node ulChild : child.childNodes()) {
                        if (ulChild.nodeName().equalsIgnoreCase("li")) {
                            result.add(new StyledText("\n• ", false, false));
                            traverse(ulChild, bold, italic, result, ListType.UL, 0);
                        } else {
                            traverse(ulChild, bold, italic, result, ListType.UL, 0);
                        }
                    }
                    break;

                default:
                    traverse(child, bold, italic, result, currentListType, itemIndex);
            }
        }
    }
}
