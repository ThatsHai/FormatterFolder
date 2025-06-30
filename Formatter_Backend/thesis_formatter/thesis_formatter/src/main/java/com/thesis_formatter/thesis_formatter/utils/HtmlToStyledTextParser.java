package com.thesis_formatter.thesis_formatter.utils;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;

import java.util.ArrayList;
import java.util.List;

public class HtmlToStyledTextParser {

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

    public List<StyledText> parseHtml(String html) {
        Element body = Jsoup.parse(html).body();
        List<StyledText> result = new ArrayList<>();
        traverse(body, false, false, result, ListType.NONE, 0);
        return result;
    }

    private enum ListType {NONE, UL, OL}

    private void traverse(Node node, boolean isBold, boolean isItalic, List<StyledText> result,
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
                case "ul":
                    traverse(child, bold, italic, result, ListType.UL, 0);
                    break;
                case "ol":
                    traverse(child, bold, italic, result, ListType.OL, 0);
                    break;
                case "li":
                    String prefix = currentListType == ListType.UL ? "• " :
                            currentListType == ListType.OL ? (itemIndex + 1) + ". " : "";
                    // Start a new line for each list item
                    result.add(new StyledText("\n" + prefix, false, false));
                    traverse(child, bold, italic, result, currentListType,
                            currentListType == ListType.OL ? itemIndex + 1 : itemIndex);
                    break;
                default:
                    traverse(child, bold, italic, result, currentListType, itemIndex);
            }
        }
    }
}
