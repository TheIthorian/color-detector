// TODO: How slow is returning new objects?
export class Complex {
    real;
    imaginary;

    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary || 0;
    }

    add(other, target) {
        target.real = this.real + other.real;
        target.imaginary = this.imaginary + other.imaginary;
        return target;
    }

    subtract(other, target) {
        target.real = this.real - other.real;
        target.imaginary = this.imaginary - other.imaginary;
        return target;
    }

    multiply(other, target) {
        const r = this.real * other.real - this.imaginary * other.imaginary;
        target.imaginary = this.real * other.imaginary + this.imaginary * other.real;
        target.real = r;
        return target;
    }

    exp(target) {
        const er = Math.exp(this.real);
        target.real = er * Math.cos(this.imaginary);
        target.imaginary = er * Math.sin(this.imaginary);
        return target;
    }

    log() {
        if (!this.real) console.log(`${this.imaginary}j`);
        else if (this.imaginary < 0) console.log(`${this.real}${this.imaginary}j`);
        else console.log(`${this.real} + ${this.imaginary}j`);
    }

    abs() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }
}
