use turbojpeg::{Compressor, Image, PixelFormat};

fn save_img() -> Result<(), Box<dyn std::error::Error>> {
    let mut jpg = image::open("pic.jpg").expect("cannot open pic.jpg");

    let image = jpg.as_mut_rgb8().expect("cannot convert to rgb8");

    let width = 1920;
    let height = 1080;
    let pixels = image.as_raw();

    // initialize a Compressor
    let mut compressor = Compressor::new()?;

    // create an Image that bundles a reference to the raw pixel data (as &[u8]) with information
    // about the image format
    let image = Image {
        pixels: pixels.as_slice(),
        width: width,
        pitch: 3 * width, // there is no padding between rows
        height: height,
        format: PixelFormat::RGB,
    };

    compressor.set_quality(100);

    // compress the Image to a Vec<u8> of JPEG data
    let jpeg_data = compressor.compress_to_vec(image)?;

    std::fs::write("image5.jpg", jpeg_data)?;


    println!("coverted");

    Ok(())
}
