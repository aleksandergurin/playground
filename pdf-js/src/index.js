require('pdfjs-dist');

PDFJS.getDocument('static/raft.pdf').then(function (pdf) {
    // Using promise to fetch the page
    pdf.getPage(1).then(function (page) {
        var scale = 1.5;
        var viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.getElementById('theCanvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //
        // Render PDF page into canvas context
        //
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
});
