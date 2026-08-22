import { box, frame, rule, text, toPng, C } from '../../lib/og-card';

/**
 * The site-wide card. Everything that is not a single article — the homepage,
 * the archives, the policy pages — shares this one, so a link to any of them
 * arrives in WhatsApp as the masthead rather than as a bare grey box.
 */
export async function GET() {
  return toPng(
    frame([
      box({ flexDirection: 'column' }, [
        rule(2, C.ink, { marginBottom: 30 }),
        text({ fontSize: 28, color: C.rubric, marginBottom: 34 }, 'দাওয়াহ, চিন্তা ও গবেষণা'),
        // Room for descenders below the baseline; Bengali clips otherwise.
        text({ fontSize: 104, color: C.ink, lineHeight: 1.2, paddingBottom: 14 }, 'আর-রিসালাহ'),
        text(
          { fontSize: 42, color: C.inkSoft, lineHeight: 1.4, paddingBottom: 10, maxWidth: 900 },
          'ইসলামকে শুধু জানা নয়—বোঝা, ভাবা এবং জীবনে প্রয়োগ করা',
        ),
      ]),

      box({ flexDirection: 'column' }, [
        rule(1, C.rule, { marginBottom: 24 }),
        box({ justifyContent: 'space-between', fontSize: 26, color: C.inkSoft }, [
          text({ color: C.ink }, 'সহজ ভাষায় ইসলাম · গভীরভাবে চিন্তা · দায়িত্বশীলভাবে গবেষণা'),
          text({}, 'ar-risalah.pages.dev'),
        ]),
      ]),
    ]),
  );
}
