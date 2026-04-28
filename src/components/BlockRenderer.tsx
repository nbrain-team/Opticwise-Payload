"use client";

import HeroBlock from "./v4-blocks/HeroBlock";
import TwoColumnBlock from "./v4-blocks/TwoColumnBlock";
import ProblemBlock from "./v4-blocks/ProblemBlock";
import PullQuoteBlock from "./v4-blocks/PullQuoteBlock";
import BotCalloutBlock from "./v4-blocks/BotCalloutBlock";
import BrainBlockBlock from "./v4-blocks/BrainBlockBlock";
import FivePlanBlock from "./v4-blocks/FivePlanBlock";
import FiveStandardBlock from "./v4-blocks/FiveStandardBlock";
import CardGridBlock from "./v4-blocks/CardGridBlock";
import AvoidFailureBlock from "./v4-blocks/AvoidFailureBlock";
import StarterKitBlock from "./v4-blocks/StarterKitBlock";
import PortfolioGridBlock from "./v4-blocks/PortfolioGridBlock";
import CallToActionBlock from "./v4-blocks/CallToActionBlock";
import RichContentBlock from "./v4-blocks/RichContentBlock";
import FAQBlock from "./v4-blocks/FAQBlock";
import FormEmbedBlock from "./v4-blocks/FormEmbedBlock";

const blockComponents: Record<string, any> = {
  hero: HeroBlock,
  twoColumn: TwoColumnBlock,
  problemBlock: ProblemBlock,
  pullQuote: PullQuoteBlock,
  botCallout: BotCalloutBlock,
  brainBlock: BrainBlockBlock,
  fivePlan: FivePlanBlock,
  fiveStandard: FiveStandardBlock,
  cardGrid: CardGridBlock,
  avoidFailure: AvoidFailureBlock,
  starterKit: StarterKitBlock,
  portfolioGrid: PortfolioGridBlock,
  callToAction: CallToActionBlock,
  richContent: RichContentBlock,
  faq: FAQBlock,
  formEmbed: FormEmbedBlock,
};

/**
 * Renders the v4 block layout for a Page or any other doc with a layout array.
 * Wraps the output in `.ow-v4` so the v4 stylesheet (which uses generic class
 * names like `.hero`, `.btn`, `.container`) is scoped and can't bleed into the
 * /insights pages or the Payload admin UI.
 */
export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="ow-v4">
      {blocks.map((block: any, index: number) => {
        const Component = blockComponents[block.blockType];
        if (!Component) {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn(`Unknown block type: ${block.blockType}`);
          }
          return null;
        }
        return <Component key={block.id || index} {...block} />;
      })}
    </div>
  );
}
