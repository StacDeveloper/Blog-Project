resource "aws_autoscaling_attachment" "example" {
    autoscaling_group_name = aws_autoscaling_group.example.id
    elb = aws_elb.example.id
}
resource "aws_autoscaling_group" "bar" {
    name = "first-time-test"
    max_size = 5
    min_size = 2
    health_check_grace_period = 300
    health_check_type = "ELB"
    desired_capacity = 4
    force_delete = 4
    placement_group = aws_placement_group.test.id
    launch_configuration = aws_launch_cofiguration
}