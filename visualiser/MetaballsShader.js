let vert = `
attribute vec4 aPosition;

varying vec2 v_uv;

void main() {
    // calculate uvs
    v_uv = aPosition.xy;
    v_uv.y *= -1.0;
    v_uv.x = v_uv.x * 0.5 + 0.5;
    v_uv.y = v_uv.y * 0.5 + 0.5; 
    
    // set position
    gl_Position = aPosition;
}
`;

let frag = `
precision mediump float;

#define MAX_BALLS 100

// ball positions
uniform float u_ballsX[MAX_BALLS];
uniform float u_ballsY[MAX_BALLS];

// ball radius
uniform float u_radius;

// colours of blobs
uniform float u_r[MAX_BALLS];
uniform float u_g[MAX_BALLS];
uniform float u_b[MAX_BALLS];

// number of balls we actually have (because arrays have to be defined with a constant size)
uniform int u_balls;

// distance field variables
uniform float u_distScale;

// width and height of the canvas
uniform float u_width;
uniform float u_height;



varying vec2 v_uv;

void main() {
    // this variable will hold our distance field info
    float r = 0.0;
    float g = 0.0;
    float b = 0.0;
    
    // go through all balls (we have to bail out manually because for loops have to be declared with a constant value in WEBGL)
    for(int i = 0; i < MAX_BALLS; ++i) {
        if(i >= u_balls)
            break;
            
        // calculate the vector between this pixel and the current ball
        vec2 diff = vec2(u_ballsX[i], u_ballsY[i]) - vec2(v_uv.x*u_width, v_uv.y*u_height);

        float len = length(diff);
        float scaled_dist = u_distScale/len;



        // Inside of ball should be one colour
        if(len<u_radius) {
            scaled_dist *= 2.;
        }
        scaled_dist = min(1.,scaled_dist);
        
        // add the scaled distance to the distance field
        r += u_r[i] * scaled_dist;
        g += u_g[i] * scaled_dist;
        b += u_b[i] * scaled_dist;


    }
    
    // calculate a color from the distance field
    gl_FragColor = vec4(min(r,1.0),min(g,1.0),min(b,1.0), 1.0);
}
`;
