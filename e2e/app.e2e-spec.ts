import { FlamingoPage } from './app.po';

describe('flamingo App', function() {
  let page: FlamingoPage;

  beforeEach(() => {
    page = new FlamingoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
