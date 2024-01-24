export class Label {
    private canvas: HTMLCanvasElement = document.createElement('canvas');
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    public fontSize: number = 16; 
    public fontFamily: string = 'Arial';


    // getTranslate(transition: StateConnection, id: number): string {
    //     const point = this.getTextPosition(transition, id);
    //     return `translate(${point.x}, ${point.y})`;
    //   }
    
    //   labels(connection: StateConnection): string[] {
    //     return connection.edges
    //     .map((edge) => edge.transitionLabel())
    //   }


    // getTextPosition(transition: StateConnection, id: number): Point {
    //     // Setzen des Schriftstils für den Canvas-Kontext
    //     this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        
    //     // Berechnung der Höhe basierend auf der Anzahl der Kanten und der Schriftgröße
    //     const height = transition.edges.length * this.fontSize;
    
    //     // Berechnung der maximalen Breite der Übergangslabels
    //     const width = transition.edges
    //       .map((edge) => this.ctx.measureText(edge.transitionLabel()).width)
    //       .reduce((a, b) => Math.max(a, b), 0);
    
    //     // Abrufen der Textposition von der Übergangsinstanz
    //     const position = transition.getLabelPosition(width, height);
    
    //     // Anpassung der y-Position basierend auf der Anzahl der Kanten
    //     const adjusted = new Point(position.x, position.y - (transition.edges.length - 1) * this.fontSize / 2);
    
    //     return adjusted;
    //   }
}